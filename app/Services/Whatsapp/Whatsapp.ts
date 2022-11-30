import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestWaWebVersion,
  useMultiFileAuthState,
} from '@adiwajshing/baileys'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'
import P from 'pino'
import { Boom } from '@hapi/boom'
import Device from 'App/Models/Device'
import { resolve } from 'path'
import md5 from 'md5'
import { existsSync, rmSync } from 'fs'
import { DateTime } from 'luxon'
import QRCode from 'qrcode-terminal'
import DatabaseStore from './WhatsappStore'

interface Response {
  status: boolean
  message: string | undefined
}

class Whatsapp {
  /**
   * Whatsapp connection sessions
   */
  protected sessions: Map<number, ReturnType<typeof makeWASocket>>

  /**
   * Constructor
   */
  constructor() {
    this.sessions = new Map<number, ReturnType<typeof makeWASocket>>()
  }

  /**
   * Create connection to whatsapp server
   *
   * @param qrCallback Function
   * @returns Promise<Response>
   */
  public connect(
    device: Device,
    qrCallback?: (qr: string) => {},
    reconnect: boolean = false
  ): Promise<Response> {
    return new Promise<Response>(async (resolve) => {
      const { id, name } = device
      if (this.get(id) && reconnect === false) {
        return resolve({
          status: true,
          message: 'Connection Already Open',
        })
      }
      const sessionPath = this.getSessionPath(id)
      const { version, isLatest } = await fetchLatestWaWebVersion()
      const { state, saveCreds } = await useMultiFileAuthState(sessionPath)

      const logger = P({
        level: 'fatal',
      }).child({ level: 'fatal' })

      Logger.info(`Device [${id}]: Starting device "${name}"`)

      this.sessions.set(
        id,
        makeWASocket({
          browser: Browsers.macOS('Chrome'),
          logger,
          auth: state,
          printQRInTerminal: false,
          version,
          markOnlineOnConnect: true,
        })
      )

      DatabaseStore.bind(this.sessions.get(id)!, logger, device.id)

      /* ################ Bailey's Event Emitter */

      // Connection update event listener
      this.sessions.get(id)?.ev.on('connection.update', async (update) => {
        try {
          const { connection, lastDisconnect, qr } = update

          if (qr) {
            Logger.info(`Device [${id}]: Got new QRCode`)
            QRCode.generate(qr, {
              small: true,
            })
            await device.merge({ status: 'RECEIVING_QR', qr: qr }).save()
            if (qrCallback) qrCallback(qr)
          }

          switch (connection) {
            case 'open':
              Logger.info(`Device [${id}]: Connection open`)
              await device.merge({ status: 'OPEN', qr: null, connectedAt: DateTime.now() }).save()
              resolve({
                status: true,
                message: 'Connection Open',
              })
              break

            case 'connecting':
              await device.merge({ status: 'CONNECTING', qr: null }).save()
              Logger.info(
                `Device [${id}]: Connecting whatsapp with version ${version}, is newer: ${
                  isLatest ? 'yes' : 'no'
                }`
              )
              break

            case 'close':
              const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
              const shouldReconnectCodes = [
                DisconnectReason.badSession, // 500
                DisconnectReason.connectionLost, // 408
                // DisconnectReason.connectionClosed, // 428
                DisconnectReason.connectionReplaced, // 440
                DisconnectReason.restartRequired, // 515
                DisconnectReason.timedOut, // 408
                // DisconnectReason.loggedOut,
                DisconnectReason.multideviceMismatch,
              ]
              const shouldReconnect =
                statusCode !== undefined && shouldReconnectCodes.includes(statusCode)

              // reconnect if not logged out
              if (shouldReconnect) {
                Logger.info(`Device [1]: Reconnecting Reason ${statusCode}`)
                resolve(this.connect(device, qrCallback, true))
              } else if (statusCode === DisconnectReason.loggedOut) {
                Logger.info(`Device [${id}]: Connection closed due to user logged out`)
                rmSync(sessionPath, {
                  force: true,
                  recursive: true,
                })
                this.sessions.delete(id)
                await device
                  .merge({ status: 'LOGGED_OUT', qr: null, disconnectedAt: DateTime.now() })
                  .save()
              } else if (statusCode === undefined) {
                Logger.info(`Device [${id}]: Disconnected`)
                this.sessions.delete(id)
                await device
                  .merge({ status: 'DISCONNECTED', qr: null, disconnectedAt: DateTime.now() })
                  .save()
              } else {
                Logger.info(`Device [${id}]: Connection closed`)
                this.sessions.delete(id)
                await device
                  .merge({ status: 'CLOSE', qr: null, disconnectedAt: DateTime.now() })
                  .save()
              }
              break
          }
        } catch (error) {
          logger.error(error, error)
        }
      })

      // Creds update event listener
      this.sessions.get(id)?.ev.on('creds.update', saveCreds)
    })
  }

  /**
   * Disconnected & Invalidate selected session
   *
   * @param device Device
   * @returns boolean
   */
  public disconnect(device: Device): boolean {
    const { id } = device

    if (this.sessions.get(id) === undefined) {
      return false
    }

    this.sessions.get(id)?.end(undefined)

    this.sessions.delete(id)
    return true
  }

  /**
   * Reconnect session
   *
   * @param device Device
   * @param qrCallback Function
   * @returns Promise<Response>
   */
  public reconnect(device: Device, qrCallback?: (qr: string) => {}): Promise<Response> {
    this.disconnect(device)

    return this.connect(device, qrCallback)
  }

  /**
   * Logout and remove session directory
   *
   * @param id number
   * @returns Promise<boolean>
   */
  public logout(id: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const session = this.get(id)

      const sessionPath = this.getSessionPath(id)

      try {
        // Logout from server when connection exists
        if (session) {
          await session.logout()
        }

        // Delete session
        if (existsSync(sessionPath)) {
          rmSync(sessionPath, {
            recursive: true,
            force: true,
          })

          const device = await Device.find(id)
          await device
            ?.merge({
              status: 'LOGGED_OUT',
              qr: null,
              disconnectedAt: DateTime.now(),
            })
            .save()
          this.sessions.delete(id)
        }
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * Get Session default path
   *
   * @param id number
   * @returns PathLike
   */
  private getSessionPath(id: number) {
    return resolve(Application.appRoot, 'sessions', md5(`session:${id}`))
  }

  /**
   * Get all sessions
   *
   * @returns Record<number, ReturnType<typeof makeWASocket>
   */
  public getAll(): Map<number, ReturnType<typeof makeWASocket>> {
    return this.sessions
  }

  /**
   * Get single session
   *
   * @param id number
   * @returns ReturnType<typeof makeWASocket> | undefiend
   */
  public get(id: number): ReturnType<typeof makeWASocket> | undefined {
    return this.sessions.get(id)
  }
}

export default new Whatsapp()

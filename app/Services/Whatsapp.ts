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
import { rmSync } from 'fs'
import { DateTime } from 'luxon'

interface Response {
  status: boolean
  message: string | undefined
}

class Whatsapp {
  /**
   * Whatsapp connection sessions
   */
  protected sessions: Record<string, ReturnType<typeof makeWASocket>> = {}

  /**
   * Create connection to whatsapp server
   *
   * @param qrCallback Function
   * @returns Promise<Response>
   */
  public connect(device: Device, qrCallback?: (qr: string) => {}): Promise<Response> {
    return new Promise<Response>(async (resolve, reject) => {
      const { id, name } = device
      const sessionPath = this.getSessionPath(id)
      const { version, isLatest } = await fetchLatestWaWebVersion()
      const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
      const logger = P({
        level: 'error',
      }).child({ level: 'error' })

      Logger.info(`Device [${id}]: Starting device "${name}"`)

      const sock = makeWASocket({
        browser: Browsers.macOS('Chrome'),
        logger,
        auth: state,
        downloadHistory: true,
        printQRInTerminal: false,
        syncFullHistory: true,
        version,
      })

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
          Logger.info(`Device [${id}]: Got new QRCode`)
          await device.merge({ status: 'RECEIVING_QR', qr: qr }).save()
          if (qrCallback) qrCallback(qr)
        }

        switch (connection) {
          case 'open':
            Logger.info(`Device [${id}]: Connection open`)
            this.sessions[id] = sock
            await device.merge({ status: 'OPEN', qr: null, connectedAt: DateTime.now() }).save()
            resolve({
              status: true,
              message: 'Connection Open',
            })
            break

          case 'connecting':
            await device.merge({ status: 'CONNECTING', qr: null }).save()
            Logger.info(
              `Device [${id}]: Trying to connecting whatsapp with version ${version}, is newer: ${
                isLatest ? 'yes' : 'no'
              }`
            )
            break

          case 'close':
            const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
            const shouldReconnect =
              statusCode !== DisconnectReason.loggedOut && statusCode !== undefined

            Logger.info(
              `Device [${id}]: Connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}, disconected reason ${statusCode}`
            )

            // reconnect if not logged out
            if (shouldReconnect) {
              Logger.info(`Device [1]: Trying to reconnecting`)
              this.connect(device, qrCallback)
                .then((res) => {
                  resolve(res)
                })
                .catch((res) => {
                  reject(res)
                })
            } else if (statusCode === DisconnectReason.loggedOut) {
              Logger.info(`Device [${id}]: Connection closed due to user logged out`)
              rmSync(sessionPath, {
                force: true,
                recursive: true,
              })
              delete this.sessions[id]
              await device
                .merge({ status: 'LOGGED_OUT', qr: null, disconnectedAt: DateTime.now() })
                .save()
              reject('Connection closed due to user logged out.')
            } else {
              Logger.info(`Device [${id}]: Connection closed`)
              rmSync(sessionPath, {
                force: true,
                recursive: true,
              })
              delete this.sessions[id]
              await device
                .merge({ status: 'CLOSE', qr: null, disconnectedAt: DateTime.now() })
                .save()
              reject('Connection closed.')
            }

            break
        }
      })

      sock.ev.on('creds.update', saveCreds)
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
  public getAll(): Record<number, ReturnType<typeof makeWASocket>> {
    return this.sessions
  }

  /**
   * Get single session
   *
   * @param id number
   * @returns ReturnType<typeof makeWASocket> | undefiend
   */
  public get(id: number): ReturnType<typeof makeWASocket> | undefined {
    return this.sessions[id]
  }
}

export default new Whatsapp()

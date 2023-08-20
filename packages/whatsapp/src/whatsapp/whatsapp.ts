import { type Contact, type WASocket } from '@whiskeysockets/baileys'
import type { Boom } from '@hapi/boom'
import type { AxiosRequestConfig } from 'axios'
import { prisma, type Prisma } from 'database'
import { upsertContact } from './event'
import { sendMessage } from '../worker/worker.helper'
import { logger } from './whatsapp.logger'
import { EventEmitter } from 'node:events'

export class Whatapp {
  public socket: WASocket | null = null
  public deviceId: string | null = null
  public localEvent: EventEmitter = new EventEmitter()

  /**
   * Asynchronously starts the function.
   *
   * @param {string} deviceId - The ID of the device.
   */
  async start(deviceId: string) {
    try {
      await prisma.$connect()
    } catch (error) {
      sendMessage({
        status: false,
        command: 'DB_CONNECTION_ERROR',
        data: error,
        message: 'Failed to connect to database',
      })
      return
    }

    /**
     * Updates a device in the database.
     *
     * @param {Prisma.DeviceUpdateInput} data - The updated data for the device.
     * @return {Promise<void>} A promise that resolves to the updated device.
     */
    const updateDevice = async (
      data: Prisma.DeviceUpdateInput,
    ): Promise<void> => {
      try {
        await prisma.device.update({
          where: {
            id: deviceId,
          },
          data,
        })
      } catch (error: any) {
        logger.warn(
          {
            trace: error?.stack,
          },
          `Failed to update device`,
        )
      }
    }

    const device = await prisma?.device.findUnique({
      where: {
        id: deviceId,
      },
    })

    if (!device) {
      sendMessage({
        status: false,
        command: 'DEVICE_NOT_FOUND',
        data: { deviceId },
      })
      return
    }

    if (this.socket !== null) {
      sendMessage({
        status: true,
        command: 'DEVICE_ALREADY_STARTED',
        data: { deviceId },
      })
      return
    }

    this.deviceId = deviceId
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Cache-Control': 'max-age=0',
      },
    }

    const {
      makeWASocket,
      DisconnectReason,
      jidNormalizedUser,
      fetchLatestWaWebVersion,
    } = await import('@whiskeysockets/baileys')
    const { listenWhatsappEvent } = await import('./whatsapp.event')
    const { useDBAuthState } = await import('./whatsapp.storage')
    const { state, saveCreds, clearCreds } = await useDBAuthState(deviceId)
    const { version } = await fetchLatestWaWebVersion(axiosConfig)

    await updateDevice({
      startedAt: new Date(),
      status: 'connecting',
      qr: null,
    })
    const sock = makeWASocket({
      version,
      logger,
      auth: state,
      browser: ['Windows', 'Desktop', '10.0.22621'],
      printQRInTerminal: process.env.NODE_ENV === 'development',
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: true,
      options: axiosConfig,
    })

    /**
     * Updates the device contact information for a given user.
     *
     * @param {Contact} user - The contact information of the user.
     */
    const updateDeviceContact = async (user: Contact) => {
      try {
        const jid = jidNormalizedUser(user.id)

        await upsertContact(
          {
            id: jid,
            name: user.name,
            verifiedName: user.verifiedName,
            notify: user.notify,
          },
          sock,
          deviceId,
        )

        await updateDevice({
          owner: {
            connect: {
              jid,
            },
          },
        })
      } catch (error: any) {
        logger.warn(
          {
            trace: error?.stack,
          },
          `Failed to update device contact after connected`,
        )
      }
    }

    sock.ev.on('creds.update', saveCreds)

    // Listen another events
    listenWhatsappEvent(sock, deviceId)

    return new Promise((resolve) => {
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (connection) {
          sendMessage({
            status: true,
            command: 'CONNECTION_UPDATE',
            data: connection,
          })
          await updateDevice({
            status: connection,
            qr: null,
          })
        }

        if (qr) {
          sendMessage({
            status: true,
            command: 'CONNECTION_UPDATE',
            data: 'receivingQr',
          })
          sendMessage({
            status: true,
            command: 'QR_RECEIVED',
            data: qr,
          })
          await updateDevice({
            qr,
            status: 'receivingQr',
          })
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
          const shouldReconnect =
            [DisconnectReason.loggedOut, 400].includes(statusCode) === false

          if (shouldReconnect) {
            logger.info(
              {
                statusCode,
                shouldReconnect,
              },
              'Device restarted automatically',
            )
            return this.start(deviceId)
          } else if (DisconnectReason.loggedOut === statusCode) {
            await updateDevice({
              status: 'loggedOut',
              qr: null,
              stoppedAt: new Date(),
            })
            sendMessage({
              status: true,
              command: 'CONNECTION_UPDATE',
              data: 'loggedOut',
            })
            await clearCreds()
          } else {
            await updateDevice({
              status: 'close',
              qr: null,
              stoppedAt: new Date(),
            })
          }

          await this.socket?.ws.close()
          sendMessage({
            command: 'STOPPED',
            status: true,
            message: 'Service Stopped',
            data: {
              disconnectReason: statusCode,
            },
          })
          this.deviceId = null
          this.socket = null

          this.localEvent.emit('close')
          return resolve(false)
        }

        if (connection === 'open') {
          if (sock.user?.id) {
            updateDeviceContact(sock.user)
          }
          this.socket = sock

          return resolve(true)
        }
      })
    })
  }

  /**
   * Reconnects the device with the specified ID.
   *
   * @param {string} deviceId - The ID of the device to reconnect.
   */
  async restart(deviceId: string) {
    await this.stop()
    await this.start(deviceId)
  }

  /**
   * Stops the function execution.
   *
   * @return {Promise<void>} Promise that resolves when the function is stopped.
   */
  async stop(): Promise<void> {
    const { Boom } = await import('@hapi/boom')
    this.socket?.end(
      new Boom('Service Stopped', {
        statusCode: 400,
      }),
    )

    return new Promise((resolve) => {
      const handleResponse = () => {
        this.localEvent.removeListener('close', handleResponse)
        resolve()
      }

      this.localEvent.on('close', handleResponse)

      setTimeout(handleResponse, 5000)
    })
  }

  /**
   * Logs the user out of the system.
   *
   * @return {Promise<void>} - This function does not accept any parameters and does not return any value.
   */
  async logout(): Promise<void> {
    await this.socket?.logout('Logged Out')

    return new Promise((resolve) => {
      const handleResponse = () => {
        this.localEvent.removeListener('close', handleResponse)
        resolve()
      }

      this.localEvent.on('close', handleResponse)

      setTimeout(handleResponse, 5000)
    })
  }
}

export default new Whatapp()

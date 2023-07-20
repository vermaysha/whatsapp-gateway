import type { WASocket } from '@whiskeysockets/baileys'
import type { Prisma } from 'database'
import type { Boom } from '@hapi/boom'

export class Whatapp {
  public socket: WASocket | null = null

  /**
   * Asynchronously starts the function.
   *
   * @param {string} deviceId - The ID of the device.
   */
  async start(deviceId: string) {
    if (this.socket !== null) {
      return
    }

    const {
      default: makeWASocket,
      Browsers,
      DisconnectReason,
    } = await import('@whiskeysockets/baileys')
    const { sendMessage } = await import('../worker/worker.helper')
    const { listenWhatsappEvent } = await import('./whatsapp.event')
    const { useMongoDBAuthState } = await import('./whatsapp.storage')

    /**
     * Updates a device in the database.
     *
     * @param {Prisma.DevicesUpdateInput} data - The updated data for the device.
     * @return {Promise<void>} A promise that resolves to the updated device.
     */
    const updateDevice = async (
      data: Prisma.DevicesUpdateInput,
    ): Promise<void> => {
      const { prisma } = await import('database')

      try {
        await prisma.devices.update({
          where: {
            id: deviceId,
          },
          data,
        })
      } catch (e) {}
    }

    const { state, saveCreds, clearCreds } = await useMongoDBAuthState(deviceId)

    await updateDevice({
      startedAt: new Date(),
      status: 'connecting',
      qr: null,
    })

    const sock = makeWASocket({
      auth: state,
      browser: Browsers.ubuntu('Google Chrome'),
      printQRInTerminal: true,
    })

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
          command: 'QR_RECEIVED',
          data: qr,
        })
        await updateDevice({
          qr,
        })
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
        const shouldReconnect =
          [DisconnectReason.loggedOut, 400].includes(statusCode) === false

        if (shouldReconnect) {
          return this.start(deviceId)
        } else if (DisconnectReason.loggedOut === statusCode) {
          await updateDevice({
            status: 'loggedOut',
            qr: null,
            stoppedAt: new Date(),
          })
          clearCreds()
        } else {
          await updateDevice({
            stoppedAt: new Date(),
          })
        }
        return
      }

      if (connection === 'open') {
        this.socket = sock
      }
    })

    sock.ev.on('creds.update', saveCreds)

    // Listen another events
    listenWhatsappEvent(sock)
  }

  /**
   * Reconnects the device with the specified ID.
   *
   * @param {string} deviceId - The ID of the device to reconnect.
   */
  async restart(deviceId: string) {
    this.stop()
    this.start(deviceId)
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

    this.socket = null
  }

  /**
   * Logs the user out of the system.
   *
   * @return {Promise<void>} - This function does not accept any parameters and does not return any value.
   */
  async logout(): Promise<void> {
    await this.socket?.logout('Logged Out')

    this.socket = null
  }
}

export default new Whatapp()

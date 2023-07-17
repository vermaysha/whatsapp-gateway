import {
  default as makeWASocket,
  Browsers,
  DisconnectReason,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { useMongoDBAuthState } from './whatsapp.storage'

type Socket = ReturnType<typeof makeWASocket>

export class Whatapp {
  public socket: Socket | null = null

  /**
   * Asynchronously starts the function.
   *
   * @param {string} deviceId - The ID of the device.
   */
  async start(deviceId: string) {
    if (this.socket !== null) {
      return
    }

    const { state, saveCreds, clearCreds } = await useMongoDBAuthState(deviceId)

    const sock = makeWASocket({
      auth: state,
      browser: Browsers.ubuntu('Google Chrome'),
      printQRInTerminal: true,
    })

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
        const shouldReconnect =
          [DisconnectReason.loggedOut, 400].includes(statusCode) === false

        if (shouldReconnect) {
          return this.start(deviceId)
        } else if (DisconnectReason.loggedOut === statusCode) {
          clearCreds()
        } else if (statusCode === 400) {
          // Service stoped
        }
        return
      }

      if (connection === 'open') {
        this.socket = sock
      }
    })

    sock.ev.on('creds.update', saveCreds)
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
  async stop() {
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
  async logout() {
    this.socket?.end(
      new Boom('Logged Out', {
        statusCode: DisconnectReason.loggedOut,
      }),
    )

    this.socket = null
  }
}

export default new Whatapp()

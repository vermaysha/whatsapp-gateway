import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestWaWebVersion,
  useMultiFileAuthState,
} from '@adiwajshing/baileys'
import Logger from '@ioc:Adonis/Core/Logger'
import P from 'pino'
import { Boom } from '@hapi/boom'
import Device from 'App/Models/Device'

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
      const { version, isLatest } = await fetchLatestWaWebVersion()
      const { state, saveCreds } = await useMultiFileAuthState('')
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
          Logger.info(`Device [${id}]: New QRCode`)
          if (qrCallback) qrCallback(qr)
        }

        switch (connection) {
          case 'open':
            Logger.info(`Device [${id}]: Connection open`)
            this.sessions[id] = sock
            resolve({
              status: true,
              message: 'Connection Open',
            })
            break

          case 'connecting':
            Logger.info(
              `Device [${id}]: Trying to connecting whatsapp with version ${version}, is newer ? ${isLatest}`
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
              delete this.sessions[id]
              reject('Connection closed due to user logged out.')
            } else {
              Logger.info(`Device [${id}]: Connection closed`)
              delete this.sessions[id]
              reject('Connection closed.')
            }

            break
        }
      })

      sock.ev.on('creds.update', saveCreds)
    })
  }
}

export default new Whatsapp()

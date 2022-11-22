import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestWaWebVersion,
  useMultiFileAuthState,
} from '@adiwajshing/baileys'
import Logger from '@ioc:Adonis/Core/Logger'
import P from 'pino'
import { Boom } from '@hapi/boom'

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
  public connect(qrCallback?: (qr: string) => {}): Promise<Response> {
    return new Promise<Response>(async (resolve, reject) => {
      const { version, isLatest } = await fetchLatestWaWebVersion()
      const { state, saveCreds } = await useMultiFileAuthState('')
      const logger = P({
        level: 'error',
      }).child({ level: 'error' })

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
          Logger.info(`Device [1]: New QRCode`)
          if (qrCallback) qrCallback(qr)
        }

        switch (connection) {
          case 'open':
            Logger.info(`Device [1]: Connection open`)
            this.sessions[1] = sock
            resolve({
              status: true,
              message: 'Connection Open',
            })
            break

          case 'connecting':
            Logger.info(
              `Device [1]: Trying to connecting whatsapp with version ${version}, is newer ? ${isLatest}`
            )
            break

          case 'close':
            const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
            const shouldReconnect =
              statusCode !== DisconnectReason.loggedOut && statusCode !== undefined

            Logger.info(
              `Device [1]: Connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}, disconected reason ${statusCode}`
            )

            // reconnect if not logged out
            if (shouldReconnect) {
              Logger.info(`Device [1]: Trying to reconnecting`)
              this.connect()
                .then((res) => {
                  resolve(res)
                })
                .catch((res) => {
                  reject(res)
                })
            } else if (statusCode === DisconnectReason.loggedOut) {
              Logger.info(`Device [1]: Connection closed due to user logged out`)
              delete this.sessions[1]
              reject('Connection closed')
            } else {
              delete this.sessions[1]
              reject('Connection closed')
            }

            break
        }
      })

      sock.ev.on('creds.update', saveCreds)
    })
  }
}

export default new Whatsapp()

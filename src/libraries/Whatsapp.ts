import waSocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
} from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { existsSync, rmSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'
import P from 'pino'

class Whatsapp {
  /**
   * Whatsapp connection Object
   *
   * @params ReturnType<typeof waSocket> | null
   */
  protected wa: ReturnType<typeof waSocket> | null

  /**
   * Whatsapp session path
   *
   * @params string
   */
  protected sessionPath: string

  /**
   * Whatsapp QRCode
   *
   * @params string
   */
  protected qrCode: string | undefined

  /**
   * Connection Status
   *
   * @params 'connecting' | 'open' | 'close'
   */
  protected connectionStatus: 'connecting' | 'open' | 'close' | undefined

  constructor() {
    this.wa = null
    this.sessionPath = resolve(cwd(), '.sessions')
    this.qrCode = undefined
    this.connectionStatus = undefined
  }

  /**
   * Connect to whatsapp server
   *
   * @returns Promise<ReturnType<typeof waSocket> | null>
   */
  public connect(
    callback?: (
      qr: string | undefined,
      connection: 'connecting' | 'open' | 'close' | undefined
    ) => void
  ) {
    return new Promise<ReturnType<typeof waSocket> | null>(async (resolve) => {
      const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath)
      const sock = waSocket({
        auth: state,
        logger: P({
          level: 'error',
        }),
        printQRInTerminal: false,
        downloadHistory: true,
        syncFullHistory: true,
        browser: Browsers.macOS('Chrome'),
      })

      if (callback) {
        callback(this.qrCode, this.connectionStatus)
      }

      /**
       * Whatsapp Creds update
       */
      sock.ev.on('creds.update', saveCreds)

      /**
       * Whatsapp Connection Events
       */
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        this.qrCode = qr

        if (callback) {
          callback(qr, connection)
        }

        switch (connection) {
          case 'connecting':
            console.log('Connecting ...')
            this.connectionStatus = 'connecting'
            this.wa = null
            break

          case 'close':
            const statusCode = (lastDisconnect?.error as Boom)?.output
              ?.statusCode
            const shouldReconnect =
              statusCode !== DisconnectReason.loggedOut &&
              statusCode !== undefined
            console.log(
              `Connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}, disconected reason ${statusCode}`
            )

            // reconnect if not logged out
            if (shouldReconnect) {
              console.log('Trying to reconnecting ...')
              return this.connect()
            } else if (statusCode === DisconnectReason.loggedOut) {
              console.log('Connection closed due to user logged out')
              if (existsSync(this.sessionPath)) {
                rmSync(this.sessionPath, {
                  force: true,
                  recursive: true,
                })
              }
              this.wa = null
              this.connectionStatus = 'close'
              resolve(null)
            }
            break

          case 'open':
            console.log('Connection open')
            this.connectionStatus = 'open'
            this.wa = sock
            resolve(this.wa)
        }
      })
    })
  }

  /**
   * Get whatsapp connection object
   *
   * @returns ReturnType<typeof waSocket> | null
   */
  public get(): ReturnType<typeof waSocket> | null {
    return this.wa
  }

  /**
   * Get QR Code
   * @returns string | undefined
   */
  public getQrCode(): string | undefined {
    return this.qrCode
  }

  /**
   * Get connection status
   *
   * @returns 'connecting' | 'open' | 'close' | undefined
   */
  public getStatus(): 'connecting' | 'open' | 'close' | undefined {
    return this.connectionStatus
  }
}

export default new Whatsapp()

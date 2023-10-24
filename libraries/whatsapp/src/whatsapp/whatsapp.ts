import {
  type WASocket,
  type WAMessageKey,
  type WAMessageContent,
  makeWASocket,
  DisconnectReason,
  fetchLatestWaWebVersion,
} from "@whiskeysockets/baileys";
import { logger } from "./whatsapp.logger";
import { prisma, Prisma } from "database";
import { useDBAuthState } from "./whatsapp.storage";
import NodeCache from "node-cache";
import { Boom } from "@hapi/boom";
import { EventEmitter } from "events";

export class Whatapp {
  /**
   * The WebSocket connection object.
   */
  public socket: WASocket | null = null;

  /**
   * The local event emitter.
   */
  public localEvent: EventEmitter = new EventEmitter()

  /**
   * Initializes a new instance of the class.
   *
   * @return {void} - There is no return value.
   */
  constructor() {
    prisma
      ?.$connect()
      .then(() => {
        logger.info("Connected to the database");
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientInitializationError) {
          logger.error(
            {
              code: error.errorCode,
              message: error.message,
            },
            error.message
          );
        } else {
          logger.error(
            {},
            error?.message ?? "Error connecting to the database"
          );
        }
      });
  }

  /**
   * Starts the WhatsApp connection.
   *
   * @return {Promise<boolean>} Returns true if the connection is successfully started.
   */
  async start(): Promise<boolean> {
    if (this.socket) {
      logger.info('WhatsApp is already running');
      return true;
    }

    const axiosConfig = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.57",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        "Cache-Control": "max-age=0",
      },
    };
    const msgRetryCounterCache = new NodeCache();

    const { state, saveCreds, clearCreds } = await useDBAuthState();
    const { version } = await fetchLatestWaWebVersion(axiosConfig);

    logger.info({}, `Trying to connect to WhatsApp with version ${version}`);

    const socket = makeWASocket({
      version,
      logger: logger as any,
      printQRInTerminal: process.env.NODE_ENV === "development",
      browser: ["Windows", "Desktop", "10.0.22621"],
      auth: state,
      msgRetryCounterCache,
      generateHighQualityLinkPreview: true,
      getMessage: this.getMessage,
      markOnlineOnConnect: true,
      options: axiosConfig,
    });

    socket.ev.process(async (events) => {
      if (events["connection.update"]) {
        const update = events["connection.update"];
        const { connection, lastDisconnect, qr } = update;

        // Update QR code
        if (qr) {
          process.send?.({
            command: "QR_UPDATED",
            data: qr,
          });
        }

        if (connection === "close") {
          // reconnect if not logged out
          const statusCode = (lastDisconnect?.error as Boom)?.output
            ?.statusCode;
          process.send?.({
            command: "CONNECTION_UPDATED",
            data: {
              status: connection,
              statusCode,
            },
          });

          this.socket = null;
          this.localEvent.emit('close', statusCode);

          if (statusCode === 400) {
            logger.info("Connection manually closed");
          } else if (statusCode === DisconnectReason.loggedOut) {
            logger.info("Connection closed. You are logged out.");
            await clearCreds();
          } else {
            this.start();
          }
        }

        if (connection === "open") {
          this.socket = socket;
        }

        if (connection === "connecting" || connection === "open") {
          process.send?.({
            command: "CONNECTION_UPDATED",
            data: {
              status: connection,
            },
          });
        }
      }

      if (events["creds.update"]) {
        await saveCreds();
      }
    });

    return true;
  }

  /**
   * Logs out the user from the current session.
   *
   * @return {Promise<void>} A Promise that resolves when the logout process is complete.
   */
  async logout(): Promise<void> {
    if (!this.socket) {
      logger.info('Whatsapp is not running, skipping logout');
      return new Promise((resolve) => resolve());
    }

    await this.socket.logout("Manually logouted");

    return new Promise((resolve) => {
      const handleResponse = (status: number) => {
        this.localEvent.removeListener('close', handleResponse)
        resolve()
      }

      this.localEvent.on('close', handleResponse)

      setTimeout(handleResponse, 30_000)
    })
  }

  /**
   * Stops the function execution and closes the connection.
   *
   * @return {Promise<void>} - A promise that resolves when the connection is closed.
   */
  async stop(): Promise<void> {
    if (!this.socket) {
      logger.info('Whatsapp is not running, skipping stop');
      return new Promise((resolve) => resolve());
    }

    this.socket.end(
      new Boom("Connection closed manually", {
        statusCode: 400,
      })
    );

    return new Promise((resolve) => {
      const handleResponse = (status: number) => {
        this.localEvent.removeListener('close', handleResponse)
        resolve()
      }

      this.localEvent.on('close', handleResponse)

      setTimeout(handleResponse, 30_000)
    })
  }

  /**
   * Retrieves a message based on a given key.
   *
   * @param {WAMessageKey} key - The key used to retrieve the message.
   * @return {Promise<WAMessageContent | undefined>} - The retrieved message content, or undefined if the message does not exist.
   */
  private async getMessage(
    key: WAMessageKey
  ): Promise<WAMessageContent | undefined> {
    return undefined;
  }
}

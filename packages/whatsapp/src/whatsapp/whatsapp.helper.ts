import type { WASocket, proto } from '@whiskeysockets/baileys'
import { getKeyAuthor } from '@whiskeysockets/baileys'

/**
 * Downloads media and saves it to the specified directory.
 *
 * @param {proto.IWebMessageInfo} message - The message containing the media to download.
 * @param {WASocket} sock - The WebSocket connection.
 * @param {string} extension - The file extension of the media.
 * @return {Promise<string>} A promise that resolves with the path of the downloaded media file.
 */
export async function downloadMedia(
  message: proto.IWebMessageInfo,
  sock: WASocket,
  extension: string,
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const { default: pino } = await import('pino')
    const { randomBytes } = await import('crypto')
    const { mkdirSync, createWriteStream } = await import('fs')
    const { downloadMediaMessage } = await import('@whiskeysockets/baileys')

    const buffer = await downloadMediaMessage(
      message,
      'buffer',
      {},
      {
        logger: pino({
          level: 'warn',
        }),
        reuploadRequest: sock.updateMediaMessage,
      },
    )

    const fixFileName = (file?: string) =>
      file?.replace(/\//g, '__')?.replace(/:/g, '-')

    const user = fixFileName(
      getKeyAuthor(message.key, sock.user?.id) || 'default',
    )

    const fileName = randomBytes(8).toString('hex')

    const fileDir = `./storages/${user}`
    mkdirSync(fileDir, { recursive: true })

    const filePath = `${fileDir}/${fileName}.${extension}`

    const writeStream = createWriteStream(filePath)
    writeStream.write(buffer)
    writeStream.end()

    writeStream.on('finish', () => {
      resolve(filePath)
    })

    writeStream.on('error', (err) => {
      reject(err.message)
    })
  })
}

/**
 * Converts a number into a timestamp by multiplying it with a multiple.
 *
 * @param {number | null} data - The number to be converted into a timestamp. Can be null.
 * @param {number} [multiple=1000] - The number to multiply the data with. Default value is 1000.
 * @return {Date | undefined} - The converted timestamp as a Date object. Returns undefined if data is falsy.
 */
export function convert2Timestamp(
  data?: number | null,
  multiple = 1000,
): Date | undefined {
  if (!data) {
    return undefined
  }

  return new Date(data * multiple)
}

/**
 * Converts an optional Uint8Array to a Buffer.
 *
 * @param {Uint8Array | null} data - The optional Uint8Array to convert.
 * @return {Buffer | undefined} The converted Buffer or undefined if data is null or undefined.
 */
export function convert2Buffer(data?: Uint8Array | null): Buffer | undefined {
  if (!data) {
    return undefined
  }

  return Buffer.from(data)
}

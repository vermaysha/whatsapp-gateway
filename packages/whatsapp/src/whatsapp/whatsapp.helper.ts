import type { WASocket, proto } from '@whiskeysockets/baileys'
import { getKeyAuthor } from '@whiskeysockets/baileys'
import axios from 'axios'
import { randomBytes } from 'crypto'
import { createWriteStream } from 'fs'
import { resolve as pathResolve } from 'path'
import { cwd } from 'process'
import { logger } from './whatsapp.logger'
import { existsSync } from 'fs'
import { mkdirSync } from 'fs'

export const ASSETS_PATH = pathResolve(
  cwd(),
  '..',
  '..',
  'apps',
  'api',
  'assets',
)

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
    const { downloadMediaMessage, jidNormalizedUser } = await import(
      '@whiskeysockets/baileys'
    )

    const buffer = await downloadMediaMessage(
      message,
      'buffer',
      {},
      {
        logger,
        reuploadRequest: sock.updateMediaMessage,
      },
    )

    const user =
      jidNormalizedUser(getKeyAuthor(message.key, sock.user?.id)) || 'default'

    const fileName = randomBytes(8).toString('hex')

    const savedPath = pathResolve(ASSETS_PATH, user)
    mkdirSync(savedPath, { recursive: true })

    const filePath = `${user}/${fileName}.${extension}`

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
 * @param {number | null | Long} data - The number to be converted into a timestamp. Can be null.
 * @param {number} [multiple=1000] - The number to multiply the data with. Default value is 1000.
 * @return {Date | undefined} - The converted timestamp as a Date object. Returns undefined if data is falsy.
 */
export function convert2Timestamp(
  data?: number | null | Long,
  multiple: number = 1000,
): Date | undefined {
  if (!data) {
    return undefined
  }

  return new Date(Number(data) * multiple)
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

/**
 * Encodes the given object into a format suitable for transmission or storage.
 *
 * @param {any} obj - The object to encode.
 * @return {any} The encoded object.
 */
export function encodeBuffer(obj: any): any {
  if (typeof obj !== 'object' || !obj) {
    return obj
  }

  if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) {
    return {
      type: 'Buffer',
      data: Buffer.from(obj).toString('base64'),
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(encodeBuffer)
  }

  const newObj: any = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      newObj[key] = encodeBuffer(obj[key])
    }
  }
  return newObj
}

/**
 * Decodes a buffer object or an array of buffer objects.
 *
 * @param {any} obj - The object to be decoded.
 * @return {any} The decoded object.
 */
export function decodeBuffer(obj: any): any {
  if (
    typeof obj !== 'object' ||
    !obj ||
    Buffer.isBuffer(obj) ||
    obj instanceof Uint8Array
  ) {
    return obj
  }

  if (obj.type === 'Buffer') {
    return Buffer.from(obj.data, 'base64')
  }

  if (Array.isArray(obj)) {
    return obj.map(decodeBuffer)
  }

  const newObj: any = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      newObj[key] = decodeBuffer(obj[key])
    }
  }
  return newObj
}

/**
 * Downloads a media file from a given URL and saves it to a specified output path.
 *
 * @param {string} url - The URL of the media file to download.
 * @param {string} [outputPath=''] - The output path to save the downloaded file. Defaults to an empty string.
 * @return {Promise<string>} A promise that resolves with the path of the saved file.
 */
export async function downloadMediaUri(
  url: string,
  outputPath: string = '',
): Promise<string> {
  try {
    const fileName = `${randomBytes(8).toString('hex')}.jpg`
    const savedPath = pathResolve(ASSETS_PATH, outputPath)
    const response = await axios.get(url, { responseType: 'stream' })

    if (!existsSync(savedPath)) {
      mkdirSync(savedPath, { recursive: true })
    }

    const outputStream = createWriteStream(pathResolve(savedPath, fileName), {
      flags: 'w+',
    })
    response.data.pipe(outputStream)

    await new Promise((resolve, reject) => {
      outputStream.on('finish', resolve)
      outputStream.on('error', reject)
    })

    return `${outputPath}/${fileName}`
  } catch (error) {
    throw new Error(`Failed to download file: ${(error as Error).message}`)
  }
}

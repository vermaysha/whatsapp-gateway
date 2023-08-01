import {
  type AuthenticationCreds,
  type AuthenticationState,
  type SignalDataTypeMap,
  initAuthCreds,
  proto,
} from '@whiskeysockets/baileys'
import { Prisma, prisma } from 'database'
import { sendMessage } from '../worker/worker.helper'

/**
 * Represents the state of authentication for MongoDB.
 */
export interface IMongoDBAuthState {
  /**
   * The current authentication state.
   */
  state: AuthenticationState

  /**
   * Saves the credentials and returns a promise that resolves when the credentials are saved successfully.
   */
  saveCreds: () => Promise<any>

  /**
   * Clears the credentials and returns a promise that resolves when the credentials are cleared successfully.
   */
  clearCreds: () => Promise<any>
}

/**
 * Encodes the given object into a format suitable for transmission or storage.
 *
 * @param {any} obj - The object to encode.
 * @return {any} The encoded object.
 */
function encodeBuffer(obj: any): any {
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
function decodeBuffer(obj: any): any {
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
 * Retrieves the MongoDB authentication state for the given device ID.
 *
 * @param {string} deviceId - The unique identifier of the device.
 * @return {Promise<IMongoDBAuthState>} A promise that resolves to the MongoDB authentication state.
 */
export async function useMongoDBAuthState(
  deviceId: string,
): Promise<IMongoDBAuthState> {
  try {
    await prisma.$connect()
  } catch (error) {
    sendMessage({
      status: false,
      command: 'DB_CONNECTION_ERROR',
      data: error,
      message: 'Failed to connect to database',
    })
    console.error('Failed to connect to database', error)
    process.exit(1)
  }

  /**
   * Writes data to the database.
   *
   * @param {any} value - The data to be written.
   * @param {string} name - The credentials name for database access.
   * @return {Promise<void>} - A promise that resolves when the data is written.
   */
  const writeData = async (value: any, name: string): Promise<void> => {
    const data = encodeBuffer(value) as Prisma.InputJsonValue

    await prisma.session.upsert({
      where: {
        deviceId_name: {
          deviceId,
          name,
        },
      },
      create: {
        name,
        deviceId,
        data,
      },
      update: {
        data,
      },
    })
  }

  /**
   * Retrieves data from the database based on the given credentials.
   *
   * @param {string} name - The credentials used to authenticate the user.
   * @return {Promise<any>} - The parsed data retrieved from the database, or null if no data is found.
   */
  const readData = async (name: string): Promise<any> => {
    const result = await prisma.session.findUnique({
      select: {
        data: true,
      },
      where: {
        deviceId_name: {
          deviceId,
          name,
        },
      },
    })

    if (result?.data) {
      return decodeBuffer(result.data)
    }

    return null
  }

  /**
   * Removes data based on the given credentials.
   *
   * @param {string} name - The credentials to use for removal.
   * @return {Promise<void>} A promise that resolves when the data is removed.
   */
  const removeData = async (name: string): Promise<void> => {
    await prisma.session.delete({
      where: {
        deviceId_name: {
          deviceId,
          name,
        },
      },
    })
  }

  /**
   * Clears the data by deleting multiple sessions that match the given device ID.
   *
   * @return {Promise<void>} A promise that resolves when the data is cleared.
   */
  const clearData = async (): Promise<void> => {
    await prisma.session.deleteMany({
      where: {
        deviceId,
      },
    })
  }

  const creds: AuthenticationCreds =
    (await readData('creds')) || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        /**
         * Retrieves data of a specified type for a given set of IDs.
         *
         * @param {T} type - The type of data to retrieve.
         * @param {string[]} ids - An array of IDs for which to retrieve data.
         * @return {Promise<{ [id: string]: SignalDataTypeMap[T] }>} - A promise that resolves with an object containing the retrieved data, where each ID is mapped to its corresponding data.
         */
        get: async <T extends keyof SignalDataTypeMap>(
          type: T,
          ids: string[],
        ): Promise<{ [id: string]: SignalDataTypeMap[T] }> => {
          const data: { [id: string]: SignalDataTypeMap[T] } = {}
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`)
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value)
              }
              data[id] = value
            }),
          )
          return data
        },

        /**
         * Sets the data in the given object.
         *
         * @param {Record<string, Record<string, unknown>>} data - The data to be set.
         * @return {Promise<void>} A promise that resolves when the data is set.
         */
        set: async (
          data: Record<string, Record<string, unknown>>,
        ): Promise<void> => {
          const tasks: Promise<any>[] = []
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id]
              const file = `${category}-${id}`
              tasks.push(value ? writeData(value, file) : removeData(file))
            }
          }

          await Promise.all(tasks)
        },

        /**
         * Clears the data asynchronously.
         *
         * @return {Promise<void>} A promise that resolves when the data is cleared.
         */
        clear: async (): Promise<void> => {
          await clearData()
        },
      },
    },

    /**
     * Saves the credentials.
     *
     * @return {Promise<void>} - A promise that resolves when the credentials are saved.
     */
    saveCreds: (): Promise<void> => {
      return writeData(creds, 'creds')
    },

    /**
     * Clears the credentials.
     *
     * @return {Promise<void>} - No return value.
     */
    clearCreds: (): Promise<void> => {
      return clearData()
    },
  }
}

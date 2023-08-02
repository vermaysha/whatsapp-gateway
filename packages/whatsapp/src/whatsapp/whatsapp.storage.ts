import {
  type AuthenticationCreds,
  type SignalDataTypeMap,
  initAuthCreds,
  proto,
} from '@whiskeysockets/baileys'
import { Prisma, prisma } from 'database'
import type { IDBAuthState } from './whatsapp.interface'
import { encodeBuffer, decodeBuffer } from './whatsapp.helper'

/**
 * Retrieves the authentication state from the database for a given device ID.
 *
 * @param {string} deviceId - The ID of the device.
 * @return {Promise<IDBAuthState>} - A promise that resolves with the authentication state.
 */
export async function useDBAuthState(deviceId: string): Promise<IDBAuthState> {
  /**
   * Writes data to the database.
   *
   * @param {any} value - The data to be written.
   * @param {string} name - The credentials name for database access.
   * @return {Promise<void>} - A promise that resolves when the data is written.
   */
  const writeData = async (value: any, name: string): Promise<void> => {
    const data = encodeBuffer(value) as Prisma.InputJsonValue

    try {
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
    } catch (error) {
      // silent is gold
    }
  }

  /**
   * Retrieves data from the database based on the given credentials.
   *
   * @param {string} name - The credentials used to authenticate the user.
   * @return {Promise<any>} - The parsed data retrieved from the database, or null if no data is found.
   */
  const readData = async (name: string): Promise<any> => {
    try {
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
    } catch (error) {
      // silent is gold
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
    try {
      await prisma.session.delete({
        where: {
          deviceId_name: {
            deviceId,
            name,
          },
        },
      })
    } catch (error) {
      // silent is gold
    }
  }

  /**
   * Clears the data by deleting multiple sessions that match the given device ID.
   *
   * @return {Promise<void>} A promise that resolves when the data is cleared.
   */
  const clearData = async (): Promise<void> => {
    try {
      await prisma.session.deleteMany({
        where: {
          deviceId,
        },
      })
    } catch (error) {
      // silent is gold
    }
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
          for (const id of ids) {
            let value = await readData(`${type}-${id}`)
            if (type === 'app-state-sync-key' && value) {
              value = proto.Message.AppStateSyncKeyData.fromObject(value)
            }
            data[id] = value
          }
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
          const promises: Promise<void>[] = []
          for (const [category, entries] of Object.entries(data)) {
            for (const [id, value] of Object.entries(entries)) {
              const key = `${category}-${id}`
              promises.push(value ? writeData(value, key) : removeData(key))
            }
          }

          await Promise.all(promises)
        },

        /**
         * Clears the data asynchronously.
         *
         * @return {Promise<void>} A promise that resolves when the data is cleared.
         */
        clear: (): Promise<void> => {
          return clearData()
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

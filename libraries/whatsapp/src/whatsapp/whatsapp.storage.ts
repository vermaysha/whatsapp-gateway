import {
  type AuthenticationCreds,
  type SignalDataTypeMap,
  initAuthCreds,
  proto,
} from "@whiskeysockets/baileys";
import { Prisma, prisma } from "database";
import type { IDBAuthState } from "./whatsapp.interface";
import { encodeBuffer, decodeBuffer } from "./whatsapp.helper";
import { logger as parentLogger } from "./whatsapp.logger";

/**
 * Retrieves the authentication state from the database for a given device ID.
 *
 * @return {Promise<IDBAuthState>} - A promise that resolves with the authentication state.
 */
export async function useDBAuthState(): Promise<IDBAuthState> {
  const logger = parentLogger.child({
    name: "Whatsapp Storage",
  });
  const maxRetries = 10;

  /**
   * Logs the given error.
   *
   * @param {any} error - The error to be logged.
   * @return {void} This function does not return anything.
   */
  const logError = (error: any): void => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(
        {
          error: {
            code: error.code,
            message: error.message,
            meta: error.meta,
          },
        },
        error.message
      );
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      logger.error({
        code: error.errorCode,
        message: error.message,
      });
    } else {
      const err = error as Error;
      logger.error({
        message: err.message,
      });
    }
  };

  /**
   * Writes data to the database.
   *
   * @param {any} value - The data to be written.
   * @param {string} name - The credentials name for database access.
   */
  const writeData = async (value: any, name: string) => {
    const data = encodeBuffer(value);
    return prisma.session.upsert({
      where: {
        name,
      },
      create: {
        name,
        data: data as Prisma.InputJsonValue,
      },
      update: {
        data,
      },
    });
  };

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
        name,
      },
    });

    if (result?.data) {
      return decodeBuffer(result.data);
    }
    return null;
  };

  /**
   * Removes data based on the given credentials.
   *
   * @param {string} name - The credentials to use for removal.
   */
  const removeData = async (name: string) => {
    return prisma.session.delete({
      where: {
        name,
      },
    });
  };

  /**
   * Clears the data by deleting multiple sessions that match the given device ID.
   *
   * @return {Promise<void>} A promise that resolves when the data is cleared.
   */
  const clearData = async (): Promise<void> => {
    let retries = 1;

    while (retries <= maxRetries) {
      try {
        await prisma.session.deleteMany({
          where: {},
        });
        break;
      } catch (error) {
        logError(error);
        retries++;
      }
    }
  };

  const creds: AuthenticationCreds =
    (await readData("creds")) || initAuthCreds();

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
          ids: string[]
        ): Promise<{ [id: string]: SignalDataTypeMap[T] }> => {
          const data: { [id: string]: SignalDataTypeMap[T] } = {};
          for (const id of ids) {
            let value = await readData(`${type}-${id}`);
            if (type === "app-state-sync-key" && value) {
              value = proto.Message.AppStateSyncKeyData.fromObject(value);
            }
            data[id] = value;
          }
          return data;
        },

        /**
         * Sets the data in the given object.
         *
         * @param {Record<string, Record<string, unknown>>} data - The data to be set.
         * @return {Promise<void>} A promise that resolves when the data is set.
         */
        set: async (
          data: Record<string, Record<string, unknown>>
        ): Promise<void> => {
          for (const [category, entries] of Object.entries(data)) {
            for (const [id, value] of Object.entries(entries)) {
              const key = `${category}-${id}`;
              if (value) {
                await writeData(value, key);
              } else {
                await removeData(key);
              }
            }
          }
        },

        /**
         * Clears the data asynchronously.
         *
         * @return {Promise<void>} A promise that resolves when the data is cleared.
         */
        clear: (): Promise<void> => {
          return clearData();
        },
      },
    },

    /**
     * Saves the credentials.
     *
     * @return {Promise<void>} - A promise that resolves when the credentials are saved.
     */
    saveCreds: async (): Promise<void> => {
      let retries = 1;
      while (retries <= maxRetries) {
        try {
          await writeData(creds, "creds");
          break;
        } catch (error) {
          logError(error);
          retries++;
        }
      }
    },

    /**
     * Clears the credentials.
     *
     * @return {Promise<void>} - No return value.
     */
    clearCreds: (): Promise<void> => {
      return clearData();
    },
  };
}

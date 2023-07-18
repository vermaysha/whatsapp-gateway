import {
  AuthenticationCreds,
  AuthenticationState,
  BufferJSON,
  SignalDataTypeMap,
  initAuthCreds,
  proto,
} from '@whiskeysockets/baileys'
import { prisma } from 'database'

export interface IMongoDBAuthState {
  state: AuthenticationState
  saveCreds: () => Promise<any>
  clearCreds: () => Promise<any>
}

export async function useMongoDBAuthState(
  deviceId: string,
): Promise<IMongoDBAuthState> {
  const writeData = async (value: any, creds: string) => {
    try {
      await prisma.$connect()
    } catch (error) {
      console.error('Failed to connect to database', error)
      process.exit(1)
    }

    const data = JSON.stringify(value, BufferJSON.replacer)

    return await prisma.sessions.upsert({
      where: {
        deviceId_creds: {
          deviceId,
          creds,
        },
      },
      create: {
        creds,
        deviceId,
        data,
      },
      update: {
        data,
      },
    })
  }

  const readData = async (creds: string) => {
    const result = await prisma.sessions.findUnique({
      select: {
        data: true,
      },
      where: {
        deviceId_creds: {
          deviceId,
          creds,
        },
      },
    })

    if (result?.data) {
      return JSON.parse(result?.data, BufferJSON.reviver)
    }

    return null
  }

  const removeData = async (creds: string) => {
    await prisma.sessions.delete({
      where: {
        deviceId_creds: {
          deviceId,
          creds,
        },
      },
    })
  }

  const clearData = async () => {
    await prisma.sessions.deleteMany({
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

        clear: async (): Promise<void> => {
          await clearData()
        },
      },
    },

    saveCreds: () => {
      return writeData(creds, 'creds')
    },

    clearCreds: () => {
      return clearData()
    },
  }
}

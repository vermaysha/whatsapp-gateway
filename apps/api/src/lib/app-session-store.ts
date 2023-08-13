import type { SessionStore } from '@fastify/session'
import { Logger } from '@nestjs/common'
import { prisma, type Prisma } from 'database'
import type * as Fastify from 'fastify'

type Callback = () => void
type CallbackSession = (
  error: null | Error,
  session: Fastify.Session | null,
) => void

export class AppSessionStore implements SessionStore {
  private model: Prisma.AppSessionDelegate = prisma.appSession
  private checkInterval?: NodeJS.Timeout
  private checkIntervalMs = 60 * 60 * 24 * 1 * 1000 // 1days

  constructor() {
    this.startInterval()
  }

  /**
   * Sets the session data for a given session ID.
   *
   * @param {string} sid - The session ID.
   * @param {Fastify.Session} session - The session object.
   * @param {Callback} callback - The callback function.
   */
  async set(
    sid: string,
    session: Fastify.Session,
    callback: Callback,
  ): Promise<void> {
    const expiresAt = session.cookie.expires ?? null

    const data: Prisma.AppSessionCreateInput = {
      sid,
      expiresAt,
      data: session as unknown as Prisma.InputJsonObject,
    }

    try {
      await this.model.upsert({
        where: {
          sid,
        },
        update: data,
        create: data,
      })
    } catch (error) {}

    callback()
  }

  /**
   * Retrieves a session from the database based on the provided session ID.
   *
   * @param {string} sid - The session ID.
   * @param {} callback - The callback function that handles the result of the session retrieval.
   */
  async get(sid: string, callback: CallbackSession): Promise<void> {
    try {
      const session = (
        await this.model.findUnique({
          where: {
            sid,
          },
          select: {
            data: true,
          },
        })
      )?.data

      if (session) {
        callback(null, session as unknown as Fastify.Session)
        return
      }
    } catch (error) {
      callback(error, null)
    }
    callback(null, null)
  }

  /**
   * Destroys the session with the given session ID and invokes the provided
   * callback function.
   *
   * @param {any} sid - The session ID.
   * @param {Callback} callback - The callback function to be invoked.
   */
  async destroy(sid: any, callback: Callback): Promise<void> {
    try {
      await this.model.deleteMany({
        where: {
          sid,
        },
      })
    } catch (err) {}
    callback()
  }

  /**
   * Starts the interval for performing a garbage collection.
   *
   * @param {function} onIntervalError - Optional callback function to handle errors that occur during the interval execution.
   * @return {void}
   */
  public startInterval(onIntervalError?: (err: unknown) => void): void {
    if (this.checkInterval) return

    const ms = this.checkIntervalMs
    if (typeof ms === 'number' && ms !== 0) {
      this.stopInterval()
      this.checkInterval = setInterval(async () => {
        try {
          await this.garbaceCollection()
        } catch (err: unknown) {
          if (onIntervalError !== undefined) onIntervalError(err)
        }
      }, Math.floor(ms))
    }
  }

  /**
   * Stops the interval.
   *
   * @return {void} -
   */
  public stopInterval(): void {
    if (this.checkInterval) clearInterval(this.checkInterval)
  }

  /**
   * Asynchronously performs garbage collection by deleting expired sessions.
   *
   * @return {Promise<void>} This function does not return anything.
   */
  async garbaceCollection(): Promise<void> {
    Logger.log('Checking for any expired sessions', AppSessionStore.name)
    const res = await this.model.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    })

    Logger.log(`Delete ${res.count} expired sessions`, AppSessionStore.name)
    return
  }
}

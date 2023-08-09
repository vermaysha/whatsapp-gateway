import type { SessionStore } from '@fastify/session'
import { prisma, type Prisma } from 'database'
import type * as Fastify from 'fastify'

type Callback = () => void
type CallbackSession = (
  error: null | Error,
  session: Fastify.Session | null,
) => void

export class AppSessionStore implements SessionStore {
  private model: Prisma.AppSessionDelegate = prisma.appSession

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
}

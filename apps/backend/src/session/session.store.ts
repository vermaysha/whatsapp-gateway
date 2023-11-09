import { SessionData, Store } from 'express-session';
import { prisma, Prisma } from 'database';

/**
 * An object containing a list of sessions where the key is the
 * ID of the session and the value is the SessionData
 */
export interface ISessions {
  [key: string]: SessionData;
}

/**
 * Runs a callback with a number of arguments on the next tick
 *
 * @param callback the function to run in the future
 * @param args the arguments for the `callback` function when it is run
 */
export const defer = <T extends (...args: A) => void, A extends unknown[]>(
  callback: T,
  ...args: A
) => {
  setImmediate(() => {
    callback(...args);
  });
};

export class SessionStore extends Store {
  private readonly model = prisma.userSession;
  private readonly logger = console;
  private checkInterval?: NodeJS.Timeout;

  constructor() {
    super();
    this.startInterval();
  }

  /**
   * Starts an interval for running a function periodically.
   *
   * @param {Function} onIntervalError - Optional callback function to handle errors that occur during the interval.
   * @return {void} This function does not return a value.
   */
  public startInterval(onIntervalError?: (err: unknown) => void): void {
    if (this.checkInterval) return;

    const ms = 1000 * 60 * 60 * 24; // 1 day
    this.stopInterval();
    this.checkInterval = setInterval(async () => {
      try {
        await this.prune();
      } catch (err: unknown) {
        if (onIntervalError !== undefined) onIntervalError(err);
      }
    }, Math.floor(ms));
  }

  /**
   * Stops the interval.
   *
   * @return {void} No return value.
   */
  public stopInterval(): void {
    if (this.checkInterval) clearInterval(this.checkInterval);
  }

  async prune() {
    this.logger.log('Checking for any expired sessions...');
    const sessions = await this.model.findMany({
      select: {
        expiresAt: true,
        sid: true,
      },
    });

    const p = this.model;
    for (const session of sessions) {
      const now = new Date();
      const remainingSec = (session.expiresAt.valueOf() - now.valueOf()) / 1000;
      this.logger.log(`session:${session.sid} expires in ${remainingSec}sec`);
      if (now.valueOf() >= session.expiresAt.valueOf()) {
        const sid = session.sid;
        this.logger.log(`Deleting session with sid: ${sid}`);
        const foundSession = await p.findUnique({ where: { sid } });
        if (foundSession !== null) await p.delete({ where: { sid } });
      }
    }
  }

  async all(
    callback?: (err?: unknown, all?: ISessions) => void,
  ): Promise<ISessions | undefined> {
    try {
      const sessions = await this.model.findMany({
        select: { sid: true, data: true },
      });

      const result = sessions
        .map(({ sid, data }) => [sid, data as unknown as SessionData] as const)
        .reduce<ISessions>(
          (prev, [sid, data]) => ({ ...prev, [sid]: data }),
          {},
        );

      if (callback) defer(callback, undefined, result);

      return result;
    } catch (e: unknown) {
      this.logger.error(`all(): ${String(e)}`);
      if (callback) defer(callback, e);
    }
  }

  /**
   * Clears the data in the model.
   *
   * @param {Function} [callback] - An optional callback function to be called when the operation is complete or an error occurs.
   * @return {Promise<void>} - A promise that resolves when the data is cleared.
   */
  async clear(callback?: (err?: unknown) => void): Promise<void> {
    try {
      await this.model.deleteMany();

      if (callback) defer(callback);
    } catch (e: unknown) {
      if (callback) defer(callback, e);
    }
  }

  /**
   * Destroys the session(s) identified by the given session ID(s).
   *
   * @param {string|string[]} sid - The session ID(s) to destroy.
   * @param {(err?: unknown) => void} [callback] - An optional callback function to be called after the session(s) have been destroyed.
   * @return {Promise<void>} A promise that resolves when the session(s) have been destroyed.
   */
  async destroy(
    sid: string | string[],
    callback?: (err?: unknown) => void,
  ): Promise<void> {
    try {
      if (Array.isArray(sid)) {
        await Promise.all(sid.map(async (id) => this.destroy(id, callback)));
      } else {
        // Calling deleteMany to prevent an error from being thrown. Fix for issue 91
        await this.model.deleteMany({
          where: { sid },
        });
      }
    } catch (e: unknown) {
      // NOTE: Attempts to delete non-existent sessions land here
      if (callback) defer(callback, e);

      return;
    }

    if (callback) defer(callback);
  }

  /**
   * Retrieves a session data object based on the session ID.
   *
   * @param {string} sid - The session ID.
   * @param {(err?: unknown, val?: SessionData) => void} [callback] - Optional callback function.
   * @return {Promise<SessionData | undefined>} A Promise that resolves to the session data object, or undefined if the session does not exist.
   */
  async get(
    sid: string,
    callback?: (err?: unknown, val?: SessionData) => void,
  ): Promise<SessionData | undefined> {
    const p = this.model;

    const session = await p
      .findUnique({
        where: { sid },
      })
      .catch(() => null);

    if (session === null) {
      callback?.();
      return undefined;
    }

    try {
      // If session has has expired (allowing for missing 'expiresAt' and 'sid' fields)
      if (
        session.sid &&
        session.expiresAt &&
        new Date().valueOf() >= session.expiresAt.valueOf()
      ) {
        this.logger.log(`Session with sid: ${sid} expired; deleting.`);
        await p.delete({ where: { sid } });
        callback?.();
        return undefined;
      }

      const result = session.data as unknown as SessionData;
      if (callback) defer(callback, undefined, result);

      return result;
    } catch (e: unknown) {
      this.logger.error(`get(): ${String(e)}`);
      if (callback) defer(callback, e);
    }
  }

  /**
   * Retrieves the length of the array and optionally calls the provided callback with the result.
   *
   * @param {function} callback - An optional callback function that will be called with the result or an error.
   * @param {unknown} err - The error object passed to the callback function if an error occurred.
   * @param {number} length - The length of the array.
   * @return {Promise<number | undefined>} - A promise that resolves to the length of the array or undefined.
   */
  async length(
    callback?: (err: unknown, length: number) => void,
  ): Promise<number | undefined> {
    try {
      const sessions = await this.model.findMany({
        select: { sid: true }, // Limit what gets sent back; can't be empty.
      });

      const itemCount = sessions.length;
      if (callback) defer(callback, undefined, itemCount);

      return itemCount;
    } catch (e: unknown) {
      if (callback) defer(callback, e, 0);
    }
  }

  /**
   * Sets a session data for a given session ID.
   *
   * @param {string} sid - The session ID.
   * @param {SessionData} session - The session data.
   * @param {(err?: unknown) => void} [callback] - An optional callback function.
   * @return {Promise<void>} - A promise that resolves when the session data is set.
   */
  async set(
    sid: string,
    session: SessionData,
    callback?: (err?: unknown) => void,
  ): Promise<void> {
    const expiresAt = session.cookie.expires ?? new Date();

    const data: Prisma.UserSessionCreateInput = {
      sid,
      expiresAt,
      data: session as unknown as Prisma.InputJsonObject,
    };

    try {
      await this.model.upsert({
        where: {
          sid,
        },
        update: data,
        create: data,
      });
    } catch (error) {
      this.logger.error(`set(): ${String(error)}`);
      if (callback) defer(callback, error);
    }

    if (callback) defer(callback);
  }

  /**
   * Updates the session data and expiresAt timestamp for a given session ID.
   *
   * @param {string} sid - The session ID.
   * @param {SessionData} session - The session data.
   * @param {(err?: unknown) => void} [callback] - An optional callback function.
   * @return {Promise<void>} - A Promise that resolves when the update is complete.
   */
  async touch(
    sid: string,
    session: SessionData,
    callback?: (err?: unknown) => void,
  ): Promise<void> {
    const expiresAt = session.cookie.expires ?? new Date();

    const data: Prisma.UserSessionCreateInput = {
      sid,
      expiresAt,
      data: session as unknown as Prisma.InputJsonObject,
    };

    try {
      await this.model.upsert({
        where: {
          sid,
        },
        update: data,
        create: data,
      });
    } catch (error) {
      this.logger.error(`touch(): ${String(error)}`);
      if (callback) defer(callback, error);
    }

    if (callback) defer(callback);
  }
}

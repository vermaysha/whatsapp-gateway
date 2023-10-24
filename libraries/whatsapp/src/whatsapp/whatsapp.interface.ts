import type { AuthenticationState } from '@whiskeysockets/baileys'

/**
 * Represents the state of authentication for MongoDB.
 */
export interface IDBAuthState {
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

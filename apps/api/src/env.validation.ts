import typia from 'typia'
export interface IConfig {
  /**
   * The encryption key.
   *
   * @minLength 32
   */
  ENCRYPTION_KEY: string

  /**
   * The application backend port.
   *
   * @default 4000
   * @type uint
   */
  BACKEND_PORT?: number

  /**
   * The session name.
   *
   * @default sessions
   * @pattern ^[a-zA-Z0-9\-._~]+$
   */
  SESSION_NAME?: string

  /**
   * Cookie HTTP Only flag.
   *
   * @default true
   */
  COOKIE_HTTPONLY?: boolean

  /**
   * Cookie Secure flag.
   * if set to true it will set the Secure-flag. If it is set to "auto" Secure-flag is set when the connection is using tls.
   *
   * @default auto
   */
  COOKIE_SECURE?: boolean | 'auto'

  /**
   * Cookie SameSite flag.
   *
   * @default lax
   */
  COOKIE_SAMESITE?: 'lax' | 'none' | 'strict' | boolean

  /**
   * Cookie Path.
   *
   * @default /
   */
  COOKIE_PATH?: string

  /**
   * Cookie MaxAge in seconds
   *
   * @default 604800
   */
  COOKIE_MAXAGE?: number
}

/**
 * Validates the given configuration object.
 *
 * @param {Record<string, any>} config - The configuration object to validate.
 * @return {Record<string, any>} - The validated configuration object.
 */
export function validate(config: Record<string, any>): Record<string, any> {
  try {
    typia.assert<IConfig>(config)
  } catch (error: any) {
    let message = error.message
    if (error instanceof typia.TypeGuardError) {
      const name = error.path?.replace('$input.', '')
      message = `Environment variable ${name} must be ${error.expected}, got ${error.value}`
    }
    throw new Error(message)
  }

  console.log(config)
  return config
}

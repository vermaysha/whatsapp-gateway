import { SetMetadata } from '@nestjs/common'

export type AuthType = 'session' | 'token' | 'all' | undefined | null
export const AUTH_TYPE: AuthType = 'session'
export const Auth = (authType: AuthType = 'session') =>
  SetMetadata(AUTH_TYPE, authType)

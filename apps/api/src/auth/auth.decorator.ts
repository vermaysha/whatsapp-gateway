import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = false
export const Auth = (mustAuthenticated: boolean = true) =>
  SetMetadata(IS_PUBLIC_KEY, mustAuthenticated)

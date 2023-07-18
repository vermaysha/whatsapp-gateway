import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      sub: string
      username: string
      iat: number
      exp: number
    } | null
    // tambahkan properti atau metode lainnya jika diperlukan
  }
}

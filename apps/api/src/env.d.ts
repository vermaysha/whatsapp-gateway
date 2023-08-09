import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  // interface FastifyRequest {
  //   user: {
  //     uuid: string
  //     username: string
  //     iat: number
  //     exp: number
  //   } | null
  //   // tambahkan properti atau metode lainnya jika diperlukan
  // }

  // Extends Fastify Session Key
  interface Session {
    user?: string
  }
}

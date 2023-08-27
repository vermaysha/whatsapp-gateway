import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      uuid: string
    }
  }

  // Extends Fastify Session Key
  interface Session {
    user: string
  }
}

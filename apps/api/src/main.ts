import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import cors, { FastifyCorsOptions } from '@fastify/cors'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  await app.register(
    cookie as any,
    {
      secret: process.env.ENCRYPTION_KEY ?? '',
      parseOptions: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 365, //1year expires
        path: '/',
      },
    } as FastifyCookieOptions,
  )
  await app.register(
    cors as any,
    {
      origin: 'http://localhost:5000',
      credentials: true,
      exposedHeaders: ['Date'],
    } as FastifyCorsOptions,
  )

  await app.listen(4000, '0.0.0.0')

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()

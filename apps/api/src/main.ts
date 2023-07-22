import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'

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
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      },
    } as FastifyCookieOptions,
  )

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  await app.listen(4000, '0.0.0.0')

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()

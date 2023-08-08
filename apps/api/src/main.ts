import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import cookie, { type FastifyCookieOptions } from '@fastify/cookie'
import cors, { type FastifyCorsOptions } from '@fastify/cors'
import etag, { type FastifyEtagOptions } from '@fastify/etag'
import staticFiles, { type FastifyStaticOptions } from '@fastify/static'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(cookie, {
    secret: process.env.ENCRYPTION_KEY ?? '',
    parseOptions: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: Date.now() + 1000 * 60 * 60 * 24 * 365, //1year expires
      path: '/',
    },
  } as FastifyCookieOptions)

  await app.register(cors, {
    origin: 'http://localhost:5000',
    credentials: true,
    exposedHeaders: ['Date'],
  } as FastifyCorsOptions)

  await app.register(etag, {
    algorithm: 'sha1',
  } as FastifyEtagOptions)

  await app.register(staticFiles, {
    root: join(__dirname, 'storages'),
    dotfiles: 'ignore',
    etag: true,
    lastModified: true,
    index: false,
    maxAge: '1m',
  } as FastifyStaticOptions)

  await app.listen(4000, '0.0.0.0')
}

bootstrap()

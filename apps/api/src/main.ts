import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import cookie, { type FastifyCookieOptions } from '@fastify/cookie'
import session, { type FastifySessionOptions } from '@fastify/session'
import cors, { type FastifyCorsOptions } from '@fastify/cors'
import etag, { type FastifyEtagOptions } from '@fastify/etag'
import staticFiles, { type FastifyStaticOptions } from '@fastify/static'
import { join } from 'path'
import { AppSessionStore } from './lib'

declare const module: any

async function bootstrap() {
  const secret = process.env.ENCRYPTION_KEY ?? ''
  const store = new AppSessionStore()
  const cookieOptions = {
    httpOnly: true,
    secure: 'auto',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1years
  }

  if (!secret) {
    throw new Error('ENCRYPTION_KEY is required')
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(cookie, {
    secret,
    parseOptions: cookieOptions,
  } as FastifyCookieOptions)

  await app.register(session, {
    secret,
    cookieName: 'sessions',
    cookie: cookieOptions,
    store,
  } as FastifySessionOptions)

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

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()

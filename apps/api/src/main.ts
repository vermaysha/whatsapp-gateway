import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import cookie, {
  type FastifyCookieOptions,
  CookieSerializeOptions,
} from '@fastify/cookie'
import session, { type FastifySessionOptions } from '@fastify/session'
import cors, { type FastifyCorsOptions } from '@fastify/cors'
import etag, { type FastifyEtagOptions } from '@fastify/etag'
import staticFiles, { type FastifyStaticOptions } from '@fastify/static'
import { join } from 'path'
import { AppSessionStore } from './lib'
import { ConfigService } from '@nestjs/config'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  const config = app.get(ConfigService)

  const secret = config.getOrThrow<string>('encryptionKey')
  const store = new AppSessionStore()
  const cookieOptions: CookieSerializeOptions = {
    httpOnly: config.get<boolean>('cookie.httpOnly'),
    secure: config.get<boolean>('cookie.secure'),
    sameSite: config.get<boolean | 'lax' | 'none' | 'strict'>(
      'cookie.sameSite',
    ),
    path: config.get<string>('cookie.path'),
    maxAge: config.get<number>('cookie.maxAge', 1) * 1000, // 1weeks
  }

  await app.register(
    cookie as any,
    {
      secret,
      parseOptions: cookieOptions,
    } as FastifyCookieOptions,
  )

  await app.register(
    session as any,
    {
      secret,
      cookieName: config.getOrThrow<string>('session.name'),
      cookie: cookieOptions,
      store,
      saveUninitialized: false,
    } as FastifySessionOptions,
  )

  await app.register(
    cors as any,
    {
      origin: config.get('cors.origin'),
      credentials: true,
      exposedHeaders: ['Date', 'Content-Range'],
      preflightContinue: true,
    } as FastifyCorsOptions,
  )

  await app.register(
    etag as any,
    {
      algorithm: 'sha1',
    } as FastifyEtagOptions,
  )

  await app.register(
    staticFiles as any,
    {
      root: join(__dirname, '..', 'assets'),
      decorateReply: true,
      serve: false,
      cacheControl: true,
      dotfiles: 'ignore',
      etag: true,
      index: false,
      lastModified: true,
      maxAge: '1w',
    } as FastifyStaticOptions,
  )

  app.setGlobalPrefix('api')

  const port = config.getOrThrow<number>('port')
  await app.listen(port, '0.0.0.0')

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SessionStore } from './session/session.store';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.set('trust proxy', 1);

  app.use(
    session({
      secret: config.getOrThrow<string>('encryption'),
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: 'auto',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
      name: 'wases',
      store: new SessionStore(),
    }),
  );

  app.enableCors({
    origin: config.get('frontend.url') ?? true,
    credentials: true,
  });

  app.enableShutdownHooks();

  app.setGlobalPrefix('api');

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get('frontend.url') ?? true,
    credentials: true,
  });

  app.enableShutdownHooks();

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { MessageController } from './message/message.controller';

@Module({
  imports: [WhatsappModule],
  controllers: [AppController, MessageController],
  providers: [AppService],
})
export class AppModule {}

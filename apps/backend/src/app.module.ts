import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [WhatsappModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

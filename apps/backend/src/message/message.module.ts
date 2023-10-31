import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [WhatsappModule, HttpModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

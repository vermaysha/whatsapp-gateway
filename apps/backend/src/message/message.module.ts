import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
@Module({
  imports: [WhatsappModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}

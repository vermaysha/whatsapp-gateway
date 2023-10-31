import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { MessageModule } from './message/message.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './event/event.module';

@Module({
  imports: [EventEmitterModule.forRoot(), WhatsappModule, MessageModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

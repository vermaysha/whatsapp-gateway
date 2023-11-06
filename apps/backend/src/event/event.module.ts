import { Module } from '@nestjs/common';
import { EventController } from './event.controller';

@Module({
  controllers: [EventController],
})
export class EventModule {}

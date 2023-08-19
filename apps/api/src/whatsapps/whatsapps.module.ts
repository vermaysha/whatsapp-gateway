import { Module } from '@nestjs/common'
import { WhatsappsService } from './whatsapps.service'
import { WhatsappsController } from './whatsapps.controller'
import { LogsService } from '../logs/logs.service'
import { EventsGateway } from '../events/events.gateway'

@Module({
  providers: [WhatsappsService, LogsService, EventsGateway],
  exports: [WhatsappsService],
  controllers: [WhatsappsController],
})
export class WhatsappsModule {}

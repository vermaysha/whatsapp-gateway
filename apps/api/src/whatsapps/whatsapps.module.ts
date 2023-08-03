import { Module } from '@nestjs/common'
import { WhatsappsService } from './whatsapps.service'
import { WhatsappsController } from './whatsapps.controller'
import { LogsService } from '../logs/logs.service'

@Module({
  providers: [WhatsappsService, LogsService],
  exports: [WhatsappsService],
  controllers: [WhatsappsController],
})
export class WhatsappsModule {}

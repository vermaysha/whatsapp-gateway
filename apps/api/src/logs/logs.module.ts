import { Module } from '@nestjs/common'
import { LogsService } from './logs.service'
import { LogsController } from './logs.controller'

@Module({
  providers: [LogsService],
  exports: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}

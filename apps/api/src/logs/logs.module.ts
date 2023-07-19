import { Module } from '@nestjs/common'
import { LogsService } from './logs.service'

@Module({
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}

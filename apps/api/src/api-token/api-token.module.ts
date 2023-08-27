import { Module } from '@nestjs/common'
import { ApiTokenService } from './api-token.service'
import { ApiTokenController } from './api-token.controller'
import { ConfigService } from '@nestjs/config'

@Module({
  providers: [ApiTokenService, ConfigService],
  exports: [ApiTokenService],
  controllers: [ApiTokenController],
})
export class ApiTokenModule {}

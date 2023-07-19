import { Module } from '@nestjs/common'
import { ApiTokenService } from './api-token.service'
import { ApiTokenController } from './api-token.controller'

@Module({
  providers: [ApiTokenService],
  exports: [ApiTokenService],
  controllers: [ApiTokenController],
})
export class ApiTokenModule {}

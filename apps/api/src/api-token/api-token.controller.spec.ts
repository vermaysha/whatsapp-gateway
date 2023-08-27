import { Test, TestingModule } from '@nestjs/testing'
import { ApiTokenController } from './api-token.controller'
import { ApiTokenModule } from './api-token.module'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { ApiTokenService } from './api-token.service'

describe('ApiTokenController', () => {
  let controller: ApiTokenController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiTokenModule, ConfigModule],
      controllers: [ApiTokenController],
      providers: [ConfigService, ApiTokenService],
    }).compile()

    controller = module.get<ApiTokenController>(ApiTokenController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

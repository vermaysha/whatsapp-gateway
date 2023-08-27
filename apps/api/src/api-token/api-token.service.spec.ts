import { Test, TestingModule } from '@nestjs/testing'
import { ApiTokenService } from './api-token.service'
import { ConfigService, ConfigModule } from '@nestjs/config'

describe('ApiTokenService', () => {
  let service: ApiTokenService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiTokenService, ConfigService],
      imports: [ConfigModule],
    }).compile()

    service = module.get<ApiTokenService>(ApiTokenService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

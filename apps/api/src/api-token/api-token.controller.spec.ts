import { Test, TestingModule } from '@nestjs/testing'
import { ApiTokenController } from './api-token.controller'

describe('ApiTokenController', () => {
  let controller: ApiTokenController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTokenController],
    }).compile()

    controller = module.get<ApiTokenController>(ApiTokenController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

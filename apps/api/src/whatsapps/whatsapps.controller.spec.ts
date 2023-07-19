import { Test, TestingModule } from '@nestjs/testing'
import { WhatsappsController } from './whatsapps.controller'

describe('WhatsappsController', () => {
  let controller: WhatsappsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsappsController],
    }).compile()

    controller = module.get<WhatsappsController>(WhatsappsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { DevicesController } from './devices.controller'

describe('DevicesController', () => {
  let controller: DevicesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
    }).compile()

    controller = module.get<DevicesController>(DevicesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

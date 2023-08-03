import { Test, TestingModule } from '@nestjs/testing'
import { DevicesController } from './devices.controller'
import { DevicesModule } from './devices.module'

describe('DevicesController', () => {
  let controller: DevicesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DevicesModule],
      controllers: [DevicesController],
    }).compile()

    controller = module.get<DevicesController>(DevicesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

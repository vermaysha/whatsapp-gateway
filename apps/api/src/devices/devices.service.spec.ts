import { Test, TestingModule } from '@nestjs/testing'
import { DevicesService } from './devices.service'

describe('DevicesService', () => {
  let service: DevicesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevicesService],
    }).compile()

    service = module.get<DevicesService>(DevicesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

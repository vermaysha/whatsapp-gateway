import { Test, TestingModule } from '@nestjs/testing'
import { WhatsappsService } from './whatsapps.service'

describe('WhatsappsService', () => {
  let service: WhatsappsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsappsService],
    }).compile()

    service = module.get<WhatsappsService>(WhatsappsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

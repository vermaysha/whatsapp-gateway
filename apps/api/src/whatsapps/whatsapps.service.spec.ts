import { Test, TestingModule } from '@nestjs/testing'
import { WhatsappsService } from './whatsapps.service'
import { LogsModule } from '../logs/logs.module'

describe('WhatsappsService', () => {
  let service: WhatsappsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LogsModule],
      providers: [WhatsappsService],
    }).compile()

    service = module.get<WhatsappsService>(WhatsappsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { WhatsappsService } from './whatsapps.service'
import { LogsModule } from '../logs/logs.module'
import { EventsGateway } from '../events/events.gateway'

describe('WhatsappsService', () => {
  let service: WhatsappsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LogsModule],
      providers: [WhatsappsService, EventsGateway],
    }).compile()

    service = module.get<WhatsappsService>(WhatsappsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

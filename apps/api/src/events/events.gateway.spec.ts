import { Test, TestingModule } from '@nestjs/testing'
import { EventsGateway } from './events.gateway'
import { AuthWsGuard } from '../auth/auth-ws.guard'
import { JwtService } from '@nestjs/jwt'

describe('EventsGateway', () => {
  let gateway: EventsGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthWsGuard, EventsGateway, JwtService],
    }).compile()

    gateway = module.get<EventsGateway>(EventsGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})

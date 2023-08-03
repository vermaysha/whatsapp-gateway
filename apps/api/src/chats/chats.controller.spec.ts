import { Test, TestingModule } from '@nestjs/testing'
import { ChatsController } from './chats.controller'
import { ChatsModule } from './chats.module'

describe('ChatsController', () => {
  let controller: ChatsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ChatsModule],
      controllers: [ChatsController],
    }).compile()

    controller = module.get<ChatsController>(ChatsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

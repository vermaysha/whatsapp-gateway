import { Test, TestingModule } from '@nestjs/testing'
import { MessagesController } from './messages.controller'
import { MessagesModule } from './messages.module'

describe('MessagesController', () => {
  let controller: MessagesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MessagesModule],
      controllers: [MessagesController],
    }).compile()

    controller = module.get<MessagesController>(MessagesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

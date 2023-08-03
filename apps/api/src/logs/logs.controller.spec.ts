import { Test, TestingModule } from '@nestjs/testing'
import { LogsController } from './logs.controller'
import { LogsModule } from './logs.module'

describe('LogsController', () => {
  let controller: LogsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LogsModule],
      controllers: [LogsController],
    }).compile()

    controller = module.get<LogsController>(LogsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

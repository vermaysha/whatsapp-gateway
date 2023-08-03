import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { AuthModule } from './auth.module'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { AuthModule } from './auth.module'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

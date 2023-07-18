import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'hash'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user === null) {
      throw new UnauthorizedException(`User ${username} not found`)
    }

    if ((await verify(user.password, pass)) === false) {
      throw new UnauthorizedException('Wrong password')
    }
    const payload = { sub: user.id, username: user.username }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}

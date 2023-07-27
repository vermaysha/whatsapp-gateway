import { ForbiddenException, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'hash'
import { User } from 'database'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user and returns an access token along with user details.
   *
   * @param {string} username - The username of the user to sign in.
   * @param {string} pass - The password of the user to sign in.
   * @return {Promise<{access_token: string, user: Users}>} A promise that resolves to an object containing the access token and user details.
   */
  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    access_token: string
    user: User
  }> {
    const user = await this.usersService.findOne(username)

    if (user === null) {
      throw new ForbiddenException(`User ${username} not found`)
    } else if ((await verify(user.password, pass)) === false) {
      throw new ForbiddenException('Wrong password')
    }

    const payload = { uuid: user.id, username: user.username }

    return {
      access_token: this.jwtService.sign(payload),
      user,
    }
  }
}

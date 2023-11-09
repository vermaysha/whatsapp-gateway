import { Injectable } from '@nestjs/common';
import { SignInDto } from './auth.dto';
import { prisma } from 'database';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  /**
   * Sign in a user.
   *
   * @param {SignInDto} params - The sign-in parameters.
   * @return {Promise<User>} The signed-in user.
   */
  async signIn(params: SignInDto) {
    const user = await prisma.user.findFirst({
      where: {
        username: params.username,
      },
    });

    if (user === null) {
      throw new Error(`User ${params.username} not found`);
    } else if ((await verify(user.password, params.password)) === false) {
      throw new Error('Wrong password');
    }

    return user;
  }
}

import { Injectable } from '@nestjs/common'
import { type User, prisma } from 'database'

@Injectable()
export class UsersService {
  /**
   * Retrieves a user from the database based on the provided username.
   *
   * @param {string} username - The username of the user to be retrieved.
   * @return {Promise<User | null>} - A promise that resolves to the user object, or null if no user is found.
   */
  async findOne(username: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        username,
      },
    })
  }
}

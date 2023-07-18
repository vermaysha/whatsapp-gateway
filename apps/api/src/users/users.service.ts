import { Injectable } from '@nestjs/common'
import { Users, prisma } from 'database'

// This should be a real class/interface representing a user entity
export type User = any

@Injectable()
export class UsersService {
  /**
   * Retrieves a user from the database based on the provided username.
   *
   * @param {string} username - The username of the user to be retrieved.
   * @return {Promise<Users | null>} - A promise that resolves to the user object, or null if no user is found.
   */
  async findOne(username: string): Promise<Users | null> {
    return await prisma.users.findFirst({
      where: {
        username: username,
      },
    })
  }
}

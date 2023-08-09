import { Injectable } from '@nestjs/common'
import { type User, prisma } from 'database'

@Injectable()
export class UsersService {
  /**
   * Retrieves a user from the database based on the provided id.
   *
   * @param {string} id - The id of the user to be retrieved.
   * @return {Promise<User | null>} - A promise that resolves to the user object, or null if no user is found.
   */
  async findOne(id?: string | null): Promise<User | null> {
    if (!id) return null

    return await prisma.user.findFirst({
      where: {
        id,
      },
    })
  }
}

import { HttpException, Injectable } from '@nestjs/common'
import { prisma, Prisma, Chats } from 'database'

export interface PaginatedChat {
  data: Chats[]
  pagination: {
    perPage: number
    page: number
    totalPages: number
    total: number
  }
}

@Injectable()
export class ChatsService {
  /**
   * Retrieves all chat data in a paginated format.
   *
   * @param {number} page - The page number to retrieve. Defaults to 1.
   * @param {number} perPage - The number of items per page. Defaults to 10.
   * @return {Promise<PaginatedChat>} A promise that resolves to a paginated chat object.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginatedChat> {
    const skipAmount = (page - 1) * perPage
    const totalCount = await this.count()
    const totalPages = Math.ceil(totalCount / perPage)

    const data = await prisma.chats.findMany({
      skip: skipAmount,
      take: perPage,
      orderBy: {
        id: 'desc',
      },
    })

    return {
      data,
      pagination: {
        page,
        perPage,
        totalPages,
        total: totalCount,
      },
    }
  }

  /**
   * Counts the number of chats.
   *
   * @return {Promise<number>} The number of chats.
   */
  async count(): Promise<number> {
    return prisma.chats.count()
  }

  /**
   * Retrieves a single Chat by its ID.
   *
   * @param {string} id - The ID of the Chat.
   * @return {Promise<Chats | null>} A Promise that resolves to the found Chat, or null if it doesn't exist.
   */
  async findOne(id: string): Promise<Chats | null> {
    return prisma.chats.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * Updates a chat record with the provided ID.
   *
   * @param {string} id - The ID of the chat to update.
   * @param {Prisma.ChatsUpdateInput} chat - The updated chat data.
   * @return {Promise<Chats>} - A promise that resolves to the updated chat record.
   */
  async update(id: string, chat: Prisma.ChatsUpdateInput): Promise<Chats> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Chat not found', 404)
    }

    return prisma.chats.update({
      where: {
        id,
      },
      data: chat,
    })
  }
}

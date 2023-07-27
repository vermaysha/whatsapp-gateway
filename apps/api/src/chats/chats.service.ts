import { HttpException, Injectable } from '@nestjs/common'
import { prisma, Prisma, Chat } from 'database'

export interface PaginatedChat {
  data: Chat[]
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

    const data = await prisma.chat.findMany({
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
   * Counts the number of chat.
   *
   * @return {Promise<number>} The number of chat.
   */
  async count(): Promise<number> {
    return prisma.chat.count()
  }

  /**
   * Retrieves a single Chat by its ID.
   *
   * @param {string} id - The ID of the Chat.
   * @return {Promise<Chat | null>} A Promise that resolves to the found Chat, or null if it doesn't exist.
   */
  async findOne(id: string): Promise<Chat | null> {
    return prisma.chat.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * Updates a chat record with the provided ID.
   *
   * @param {string} id - The ID of the chat to update.
   * @param {Prisma.ChatUpdateInput} chat - The updated chat data.
   * @return {Promise<Chat>} - A promise that resolves to the updated chat record.
   */
  async update(id: string, chat: Prisma.ChatUpdateInput): Promise<Chat> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Chat not found', 404)
    }

    return prisma.chat.update({
      where: {
        id,
      },
      data: chat,
    })
  }
}

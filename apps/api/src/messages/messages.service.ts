import { HttpException, Injectable } from '@nestjs/common'
import { prisma, type Messages, Prisma } from 'database'

export interface PaginatedMessage {
  data: Messages[]
  pagination: {
    perPage: number
    page: number
    totalPages: number
    total: number
  }
}

@Injectable()
export class MessagesService {
  /**
   * Retrieves all messages with pagination.
   *
   * @param {number} page - The page number to retrieve.
   * @param {number} perPage - The number of messages per page.
   * @return {Promise<PaginatedMessage>} A promise that resolves to a paginated message object.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginatedMessage> {
    const skipAmount = (page - 1) * perPage
    const totalCount = await this.count()
    const totalPages = Math.ceil(totalCount / perPage)

    const data = await prisma.messages.findMany({
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
   * Counts the number of messages.
   *
   * @return {Promise<number>} The number of messages.
   */
  async count(): Promise<number> {
    return prisma.messages.count()
  }

  /**
   * Retrieves a single message by its ID.
   *
   * @param {string} id - The ID of the message to retrieve.
   * @return {Promise<Messages | null>} A promise that resolves to the retrieved message, or null if no message is found.
   */
  async findOne(id: string): Promise<Messages | null> {
    return prisma.messages.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * Updates a message by its ID.
   *
   * @param {string} id - The ID of the message to be updated.
   * @param {Prisma.MessagesUpdateInput} message - The updated message object.
   * @return {Promise<Messages>} The updated message.
   */
  async update(
    id: string,
    message: Prisma.MessagesUpdateInput,
  ): Promise<Messages> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Message not found', 404)
    }

    return prisma.messages.update({
      where: {
        id,
      },
      data: message,
    })
  }
}

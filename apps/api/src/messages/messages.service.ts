import { HttpException, Injectable } from '@nestjs/common'
import { prisma, type Message, Prisma } from 'database'

export interface PaginatedMessage {
  data: Message[]
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

    const data = await prisma.message.findMany({
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
   * Counts the number of message.
   *
   * @return {Promise<number>} The number of message.
   */
  async count(): Promise<number> {
    return prisma.message.count()
  }

  /**
   * Retrieves a single message by its ID.
   *
   * @param {string} id - The ID of the message to retrieve.
   * @return {Promise<Message | null>} A promise that resolves to the retrieved message, or null if no message is found.
   */
  async findOne(id: string): Promise<Message | null> {
    return prisma.message.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * Updates a message by its ID.
   *
   * @param {string} id - The ID of the message to be updated.
   * @param {Prisma.MessageUpdateInput} message - The updated message object.
   * @return {Promise<Message>} The updated message.
   */
  async update(
    id: string,
    message: Prisma.MessageUpdateInput,
  ): Promise<Message> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Message not found', 404)
    }

    return prisma.message.update({
      where: {
        id,
      },
      data: message,
    })
  }
}

import { HttpException, Injectable } from '@nestjs/common'
import { prisma, type Message, Prisma } from 'database'
import { ListDTO } from './messages.dto'
import { exclude, paginate } from 'pagination'

@Injectable()
export class MessagesService {
  /**
   * Find all messages based on the provided parameters.
   *
   * @param {ListDTO} params - The parameters for the query.
   */
  async findAll(params: ListDTO) {
    const { page, perPage, order, orderBy, search, device } = params

    const orderQuery:
      | Prisma.MessageOrderByWithRelationAndSearchRelevanceInput
      | undefined = search
      ? {
          _relevance: search
            ? {
                fields: ['text', 'title'],
                search,
                sort: 'desc',
              }
            : undefined,
        }
      : {
          [orderBy ?? 'createdAt']: order ?? 'desc',
        }

    const messageInclude = Prisma.validator<Prisma.MessageInclude>()({
      contact: true,
    })

    const where: Prisma.MessageWhereInput | undefined = device
      ? {
          contact: {
            deviceId: device,
          },
        }
      : undefined

    return paginate<
      Prisma.MessageFindManyArgs,
      Prisma.MessageGetPayload<{
        include: typeof messageInclude
      }>,
      'contactId' | 'deviceId' | 'chatId'
    >(
      prisma.message,
      {
        orderBy: orderQuery,
        include: messageInclude,
        where,
      },
      {
        page,
        perPage,
      },
      ['contactId', 'deviceId', 'chatId'],
    )
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
   * Finds a message by its ID.
   *
   * @param {string} id - The ID of the message.
   */
  async findOne(id: string) {
    const data = await prisma.message.findUnique({
      where: {
        id,
      },
      include: {
        contact: true,
        chat: true,
      },
    })

    if (!data) {
      return null
    }

    return exclude(data, ['contactId', 'deviceId', 'chatId'])
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

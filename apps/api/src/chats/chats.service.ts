import { Injectable } from '@nestjs/common'
import { prisma, Prisma, Chat } from 'database'
import { IChatsList } from './chats.dto'
import { exclude, paginate } from 'pagination'

@Injectable()
export class ChatsService {
  /**
   * Retrieves a list of chats based on the provided parameters.
   *
   * @param {IChatsList} params - The parameters used to filter and paginate the chats.
   * @param {number} params.page - The page number of the chats to retrieve.
   * @param {number} params.perPage - The number of chats per page.
   * @param {string} params.order - The order in which the chats should be sorted.
   * @param {string} params.orderBy - The field to orderBy the chats by.
   * @param {string} params.device - The device ID to filter the chats by.
   */
  async findAll(params: IChatsList) {
    const { page, perPage, order, orderBy, device } = params

    const orderQuery: Prisma.ChatOrderByWithRelationAndSearchRelevanceInput = {
      [orderBy ?? 'createdAt']: order ?? 'desc',
    }

    const chatInclude = Prisma.validator<Prisma.ChatInclude>()({
      contact: true,
      messages: {
        take: 1,
        orderBy: {
          updatedAt: 'desc',
        },
      },
    })

    const where: Prisma.ChatWhereInput | undefined = device
      ? {
          contact: {
            deviceId: device,
          },
        }
      : undefined

    return paginate<
      Prisma.ChatFindManyArgs,
      Prisma.ChatGetPayload<{
        include: typeof chatInclude
      }>,
      'deviceId' | 'contactId'
    >(
      prisma.chat,
      {
        orderBy: orderQuery,
        include: chatInclude,
        where,
      },
      {
        page,
        perPage,
      },
      ['deviceId', 'contactId'],
    )
  }

  /**
   * Find a chat by its ID and optional device ID.
   *
   * @param {string} id - The ID of the chat.
   * @param {string | null} deviceId - The optional device ID of the chat.
   */
  async findOne(id: string, deviceId?: string | null) {
    const data = await prisma.chat.findUnique({
      include: {
        contact: true,
      },
      where: {
        id,
        deviceId: deviceId || undefined,
      },
    })

    if (!data) {
      return null
    }

    return exclude(data, ['deviceId', 'contactId'])
  }
}

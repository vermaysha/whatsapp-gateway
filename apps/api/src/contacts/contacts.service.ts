import { Injectable } from '@nestjs/common'
import { prisma, Prisma, Contact } from 'database'
import { paginate } from 'pagination'
import { ListDTO } from './contacts.dto'

@Injectable()
export class ContactsService {
  /**
   * Finds all items based on the provided parameters.
   *
   * @param {ListDTO} params - The parameters for filtering and pagination.
   * @param {string} userId - The ID of the device.
   * @return {Promise<Prisma.ContactGetPayload<any>[]>} An array of contacts that match the provided parameters.
   */
  async findAll(params: ListDTO, userId: string) {
    const { page, perPage, order, orderBy, search, device } = params

    const orderQuery:
      | Prisma.ContactOrderByWithRelationAndSearchRelevanceInput
      | undefined = search
      ? {
          _relevance: search
            ? {
                fields: ['name', 'notify', 'verifiedName'],
                search,
                sort: 'desc',
              }
            : undefined,
        }
      : {
          [orderBy ?? 'updatedAt']: order ?? 'desc',
        }

    const where: Prisma.ContactWhereInput | undefined = device
      ? {
          devices: {
            id: device,
            userId,
          },
        }
      : undefined

    return paginate<
      Prisma.ContactFindManyArgs,
      Prisma.ContactGetPayload<any>,
      undefined
    >(
      prisma.contact,
      {
        orderBy: orderQuery,
        where,
      },
      {
        page,
        perPage,
      },
    )
  }

  /**
   * Finds a contact by its ID and device ID.
   *
   * @param {string} id - The ID of the contact.
   * @param {string} deviceId - The ID of the device.
   * @return {Promise<Contact | null>} A promise that resolves to the found contact or null if not found.
   */
  async findOne(id: string, deviceId?: string): Promise<Contact | null> {
    return prisma.contact.findFirst({
      where: {
        id,
        deviceId,
      },
    })
  }
}

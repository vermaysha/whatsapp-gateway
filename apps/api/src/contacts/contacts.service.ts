import { HttpException, Injectable } from '@nestjs/common'
import { prisma, Prisma, Contacts } from 'database'

export interface PaginatedContact {
  data: Contacts[]
  pagination: {
    perPage: number
    page: number
    totalPages: number
    total: number
  }
}

@Injectable()
export class ContactsService {
  /**
   * Retrieves all contacts with pagination.
   *
   * @param {number} page - The page number to retrieve.
   * @param {number} perPage - The number of contacts to retrieve per page.
   * @return {Promise<PaginatedContact>} A promise that resolves to a paginated list of contacts.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginatedContact> {
    const skipAmount = (page - 1) * perPage
    const totalCount = await this.count()
    const totalPages = Math.ceil(totalCount / perPage)

    const data = await prisma.contacts.findMany({
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
   * Counts the number of contacts.
   *
   * @return {Promise<number>} The number of contacts.
   */
  async count(): Promise<number> {
    return prisma.contacts.count()
  }

  async findOne(id: string): Promise<Contacts | null> {
    return prisma.contacts.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * Updates a contact record with the specified ID.
   *
   * @param {string} id - The ID of the contact to update.
   * @param {Prisma.ContactsUpdateInput} chat - The updated information for the contact.
   * @return {Promise<Contacts>} The updated contact record.
   */
  async update(
    id: string,
    chat: Prisma.ContactsUpdateInput,
  ): Promise<Contacts> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Chat not found', 404)
    }

    return prisma.contacts.update({
      where: {
        id,
      },
      data: chat,
    })
  }
}

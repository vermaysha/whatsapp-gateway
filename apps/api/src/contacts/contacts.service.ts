import { HttpException, Injectable } from '@nestjs/common'
import { prisma, Prisma, Contact } from 'database'

export interface PaginatedContact {
  data: Contact[]
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
   * @return {Promise<PaginatedContact>} A promise that resolves to a paginated list of contact.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginatedContact> {
    const skipAmount = (page - 1) * perPage
    const totalCount = await this.count()
    const totalPages = Math.ceil(totalCount / perPage)

    const data = await prisma.contact.findMany({
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
   * Counts the number of contact.
   *
   * @return {Promise<number>} The number of contact.
   */
  async count(): Promise<number> {
    return prisma.contact.count()
  }

  async findOne(id: string): Promise<Contact | null> {
    return prisma.contact.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * Updates a contact record with the specified ID.
   *
   * @param {string} id - The ID of the contact to update.
   * @param {Prisma.ContactUpdateInput} chat - The updated information for the contact.
   * @return {Promise<Contact>} The updated contact record.
   */
  async update(id: string, chat: Prisma.ContactUpdateInput): Promise<Contact> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Chat not found', 404)
    }

    return prisma.contact.update({
      where: {
        id,
      },
      data: chat,
    })
  }
}

import { HttpException, Injectable } from '@nestjs/common'
import { ApiToken, Prisma, prisma } from 'database'
import { randomBytes } from 'crypto'

export interface PaginatedApiToken {
  data: ApiToken[]
  pagination: {
    perPage: number
    page: number
    totalPages: number
    total: number
  }
}

@Injectable()
export class ApiTokenService {
  /**
   * Retrieves paginated API tokens.
   *
   * @param {number} page - The page number to retrieve (default: 1).
   * @param {number} perPage - The number of items per page (default: 10).
   * @return {Promise<PaginatedApiToken>} The paginated API tokens.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginatedApiToken> {
    const skipAmount = (page - 1) * perPage
    const totalCount = await this.count()
    const totalPages = Math.ceil(totalCount / perPage)

    const data = await prisma.apiToken.findMany({
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
   * Counts the number of API tokens.
   *
   * @return {Promise<number>} The number of API tokens.
   */
  async count(): Promise<number> {
    return prisma.apiToken.count()
  }

  /**
   * Retrieves a single API token by its ID.
   *
   * @param {string} id - The ID of the API token to retrieve.
   * @return {Promise<ApiToken | null>} A Promise that resolves to the retrieved API token, or null if no token is found.
   */
  async findOne(id: string): Promise<ApiToken | null> {
    return prisma.apiToken.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * Creates a new API token.
   *
   * @param {Omit<Prisma.ApiTokenCreateInput, 'token'>} data - The data for creating the API token.
   * @return {Promise<ApiToken>} The newly created API token.
   */
  async create(
    data: Omit<Prisma.ApiTokenCreateInput, 'token'>,
  ): Promise<ApiToken> {
    const input: Prisma.ApiTokenCreateInput = {
      name: data.name,
      description: data.description,
      expiredAt: data.expiredAt,
      user: data.user,
      token: this.generateToken(),
    }
    return prisma.apiToken.create({
      data: input,
    })
  }

  /**
   * Generates a token using a random string of bytes and returns it.
   *
   * @return {string} The generated token.
   */
  generateToken(): string {
    const rand = randomBytes(64).toString('hex')
    return `at_${rand}`
  }

  /**
   * Deletes an API token.
   *
   * @param {string} id - The ID of the API token to delete.
   * @return {Promise<void>} A promise that resolves when the API token is deleted.
   */
  async delete(id: string): Promise<void> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Api Token not found', 404)
    }

    await prisma.apiToken.delete({
      where: {
        id,
      },
    })
  }
}

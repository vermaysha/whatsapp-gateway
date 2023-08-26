import { Injectable } from '@nestjs/common'
import { ApiToken, Prisma, prisma } from 'database'
import { createHash, createHmac, randomBytes } from 'crypto'
import { ListDTO } from './api-token.dto'
import { exclude, paginate } from 'pagination'

@Injectable()
export class ApiTokenService {
  /**
   * Retrieves a list of API tokens for a given user.
   *
   * @param {ListDTO} params - The parameters for filtering and pagination.
   * @param {string} userId - The ID of the user.
   * @return {object[]} The list of API tokens.
   */
  async findAll(params: ListDTO, userId: string) {
    const { page, perPage, order, orderBy, search } = params

    const include = Prisma.validator<Prisma.ApiTokenInclude>()({
      history: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    })

    const orderQuery:
      | Prisma.ApiTokenOrderByWithRelationAndSearchRelevanceInput
      | undefined = search
      ? {
          _relevance: search
            ? {
                fields: ['name', 'description'],
                search,
                sort: 'desc',
              }
            : undefined,
        }
      : {
          [orderBy ?? 'createdAt']: order ?? 'desc',
        }

    const data = await paginate<
      Prisma.ApiTokenFindManyArgs,
      Prisma.ApiTokenGetPayload<{
        include: typeof include
      }>,
      'userId' | 'token'
    >(
      prisma.apiToken,
      {
        orderBy: orderQuery,
        include,
        where: {
          userId,
        },
      },
      {
        page,
        perPage,
      },
      ['userId', 'token'],
    )

    return data
  }

  /**
   * Retrieves a single API token by its ID.
   *
   * @param {string} id - The ID of the API token to retrieve.
   * @return {Promise<object | null>} The API token object, or null if not found.
   */
  async findOne(id: string) {
    const data = await prisma.apiToken.findUnique({
      where: {
        id,
      },
      include: {
        history: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!data) {
      return null
    }

    return exclude(data, ['userId', 'token'])
  }

  /**
   * Creates a new API token.
   *
   * @param {Omit<Prisma.ApiTokenCreateInput, 'token'>} data - The data for creating the API token.
   * @return {Promise<object>} The newly created API token.
   */
  async create(data: Omit<Prisma.ApiTokenCreateInput, 'token'>) {
    const token = this.generateToken()
    const input: Prisma.ApiTokenCreateInput = {
      name: data.name,
      description: data.description,
      expiredAt: data.expiredAt,
      user: data.user,
      token,
    }

    const result = exclude(
      await prisma.apiToken.create({
        data: input,
      }),
      ['userId'],
    )

    return result
  }

  /**
   * Verifies the given token.
   *
   * @param {string} token - The token to be verified.
   * @return {Promise<boolean>} A boolean indicating whether the token is valid or not.
   */
  async verifyToken(token: string): Promise<boolean> {
    const result = await prisma.apiToken.count({
      where: {
        token,
      },
    })

    return result > 0
  }

  /**
   * Generates a token using a random string of bytes and returns it.
   *
   * @return {string} The generated token.
   */
  generateToken(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const bytes = randomBytes(64)
    let token = 'at_'

    for (const byteElement of bytes) {
      const index = byteElement % characters.length
      token += characters[index]
    }

    return token
  }

  /**
   * Deletes an API token.
   *
   * @param {string} id - The ID of the API token to delete.
   * @return {Promise<void>} A promise that resolves when the API token is deleted.
   */
  async delete(id: string): Promise<void> {
    await prisma.apiToken.delete({
      where: {
        id,
      },
    })
  }
}

import { Injectable } from '@nestjs/common'
import { ApiToken, Prisma, prisma } from 'database'
import { randomBytes } from 'crypto'
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
          [orderBy ?? 'created']: order ?? 'desc',
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
          take: 5,
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
    await prisma.apiToken.delete({
      where: {
        id,
      },
    })
  }
}

import { Injectable } from '@nestjs/common'
import { Prisma, prisma } from 'database'
import { createHmac, randomBytes } from 'crypto'
import { ListDTO, PaginationDTO } from './api-token.dto'
import { exclude, paginate } from 'pagination'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApiTokenService {
  constructor(private configService: ConfigService) {}
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
        select: {
          updatedAt: true,
          ip: true,
          userAgent: true,
        },
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
   * Retrieves the history of API token based on the provided parameters.
   *
   * @param {PaginationDTO} params - The pagination parameters for retrieving the history.
   * @param {string} userId - The ID of the user.
   * @param {string} tokenId - The ID of the API token.
   * @return {Promise<any>} The API token history data.
   */
  async history(params: PaginationDTO, userId: string, tokenId: string) {
    const { page, perPage } = params

    const data = await paginate<
      Prisma.ApiTokenHistoryFindManyArgs,
      Prisma.ApiTokenHistoryGetPayload<object>,
      'apiTokenId'
    >(
      prisma.apiTokenHistory,
      {
        where: {
          apiToken: {
            userId,
            id: tokenId,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
      {
        page,
        perPage,
      },
      ['apiTokenId'],
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
    const today = new Date()
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )

    const data = await prisma.apiToken.findUnique({
      where: {
        id,
      },
    })

    if (!data) {
      return null
    }

    const todayUsage = await prisma.apiTokenHistory.count({
      where: {
        apiTokenId: data.id,
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    const totalUsage = await prisma.apiTokenHistory.count({
      where: {
        apiTokenId: data.id,
      },
    })

    return Object.assign(exclude(data, ['userId', 'token']), {
      todayUsage,
      totalUsage,
    })
  }

  /**
   * Creates a new API token.
   *
   * @param {Omit<Prisma.ApiTokenCreateInput, 'token'>} data - The data for creating the API token.
   * @return {Promise<object>} The newly created API token.
   */
  async create(data: Omit<Prisma.ApiTokenCreateInput, 'token'>) {
    const [token, hashed] = this.generateToken()
    const input: Prisma.ApiTokenCreateInput = {
      name: data.name,
      description: data.description,
      expiredAt: data.expiredAt,
      user: data.user,
      token: hashed,
    }

    const result = exclude(
      await prisma.apiToken.create({
        data: input,
      }),
      ['userId'],
    )

    result.token = token

    return result
  }

  /**
   * Verifies the given token.
   *
   * @param {string} token - The token to be verified.
   */
  async verifyToken(token: string) {
    const result = await prisma.apiToken.findFirst({
      where: {
        token: this.hash(token),
      },
    })

    return result
  }

  /**
   * Hashes a given token using the HMAC-SHA1 algorithm.
   *
   * @param {string} token - The token to be hashed.
   * @return {string} - The hashed token.
   */
  hash(token: string): string {
    const hmac = createHmac(
      'sha1',
      this.configService.getOrThrow('encryptionKey'),
    )

    return hmac.update(token).digest('hex')
  }

  /**
   * Generates a token consisting of random characters and returns an array
   * containing the token and its hashed value.
   *
   * @return {string[]} An array containing the generated token and its hashed value.
   */
  generateToken(): string[] {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const bytes = randomBytes(32)
    let token = 'at_'

    for (const byteElement of bytes) {
      const index = byteElement % characters.length
      token += characters[index]
    }

    const hashed = this.hash(token)

    return [token, hashed]
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

  /**
   * Inserts a new history record for an API token.
   *
   * @param {Prisma.ApiTokenHistoryCreateInput} data - The data to be inserted.
   * @param {string} tokenId - The ID of the token to insert the history for.
   * @return {Promise<void>} - A promise that resolves when the insertion is complete.
   */
  async insertHistory(
    data: Prisma.ApiTokenHistoryCreateInput,
    tokenId: string,
  ) {
    await prisma.apiToken.update({
      where: {
        id: tokenId,
      },
      data: {
        history: {
          create: data,
        },
      },
    })
  }
}

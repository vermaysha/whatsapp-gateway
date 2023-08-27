import { Injectable } from '@nestjs/common'
import { Prisma, prisma } from 'database'
import { createHmac, randomBytes } from 'crypto'
import { ListDTO } from './api-token.dto'
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
   * @return {Promise<boolean>} A boolean indicating whether the token is valid or not.
   */
  async verifyToken(token: string): Promise<boolean> {
    const result = await prisma.apiToken.count({
      where: {
        token: this.hash(token),
      },
    })

    return result > 0
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
}

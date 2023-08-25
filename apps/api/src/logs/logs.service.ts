import { Injectable } from '@nestjs/common'
import { Logs, Prisma, prisma } from 'database'
import { ILogsList } from './logs.dto'
import { exclude, paginate } from 'pagination'

@Injectable()
export class LogsService {
  /**
   * Find all logs based on the provided parameters.
   *
   * @param {ILogsList} params - The parameters for finding logs.
   * @param {number} params.page - The page number.
   * @param {number} params.perPage - The number of logs per page.
   * @param {string} params.order - The order of the logs.
   * @param {string} params.orderBy - The field to order the logs by.
   * @param {string} params.search - The search query for logs.
   * @param {string} params.device - The device ID for filtering logs.
   */
  async findAll(params: ILogsList) {
    const { page, perPage, order, orderBy, search, device } = params

    const orderQuery:
      | Prisma.LogsOrderByWithRelationAndSearchRelevanceInput
      | undefined = search
      ? {
          _relevance: search
            ? {
                fields: ['msg', 'trace'],
                search,
                sort: 'desc',
              }
            : undefined,
        }
      : {
          [orderBy ?? 'createdAt']: order ?? 'desc',
        }

    const where: Prisma.LogsWhereInput | undefined = device
      ? {
          deviceId: device,
        }
      : undefined

    return paginate<Prisma.LogsFindManyArgs, Logs, 'deviceId'>(
      prisma.message,
      {
        orderBy: orderQuery,
        where,
      },
      {
        page,
        perPage,
      },
      ['deviceId'],
    )
  }

  /**
   * Finds a log entry by its ID and optional device ID.
   *
   * @param {string} id - The ID of the log entry.
   * @param {string | null} device - The optional device ID. Defaults to null.
   */
  async findOne(id: string, device?: string | null) {
    const data = await prisma.logs.findUnique({
      where: {
        id,
        deviceId: device || undefined,
      },
    })

    if (!data) {
      return null
    }

    return exclude(data, ['deviceId'])
  }

  /**
   * Creates a new log entry.
   *
   * @param {Prisma.LogsCreateInput} logs - The log data to be created.
   * @return {Promise<Logs>} The created log entry.
   */
  async create(logs: Prisma.LogsCreateInput): Promise<Logs> {
    return prisma.logs.create({
      data: logs,
    })
  }
}

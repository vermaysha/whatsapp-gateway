import { Injectable } from '@nestjs/common'
import { Logs, Prisma, prisma } from 'database'

export interface PaginatedDevice {
  data: Logs[]
  pagination: {
    perPage: number
    page: number
    totalPages: number
    total: number
  }
}

@Injectable()
export class LogsService {
  /**
   * Retrieves a paginated list of devices.
   *
   * @param {number} page - The page number to retrieve (default: 1).
   * @param {number} perPage - The number of items per page (default: 10).
   * @return {Promise<PaginatedDevice>} A promise that resolves to a paginated list of devices.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginatedDevice> {
    const skipAmount = (page - 1) * perPage
    const totalCount = await this.count()
    const totalPages = Math.ceil(totalCount / perPage)

    const data = await prisma.logs.findMany({
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
   * Retrieves the count of logs.
   *
   * @return {Promise<number>} The count of logs.
   */
  async count(): Promise<number> {
    return prisma.logs.count()
  }

  /**
   * Retrieves a single log by its ID.
   *
   * @param {string} id - The ID of the log to retrieve.
   * @return {Promise<Logs | null>} A Promise that resolves to the retrieved log, or null if not found.
   */
  async findOne(id: string): Promise<Logs | null> {
    return prisma.logs.findUnique({
      where: {
        id,
      },
    })
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

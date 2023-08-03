import { HttpException, Injectable } from '@nestjs/common'
import { Device, Prisma, prisma } from 'database'

export interface PaginatedDevice {
  data: Device[]
  pagination: {
    perPage: number
    page: number
    totalPages: number
    total: number
  }
}

@Injectable()
export class DevicesService {
  /**
   * Retrieves a paginated list of device.
   *
   * @param {number} page - The page number to retrieve (default: 1).
   * @param {number} perPage - The number of devices per page (default: 10).
   * @return {Promise<PaginatedDevice>} A promise that resolves to a `PaginatedDevice` object containing the retrieved devices and pagination information.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginatedDevice> {
    const skipAmount = (page - 1) * perPage
    const totalCount = await this.count()
    const totalPages = Math.ceil(totalCount / perPage)

    const data = await prisma.device.findMany({
      skip: skipAmount,
      take: perPage,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        owner: true,
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
   * Counts the number of devices in the database.
   *
   * @return {Promise<number>} The number of device.
   */
  async count(): Promise<number> {
    return prisma.device.count()
  }

  /**
   * Retrieves a single device by its ID.
   *
   * @param {string} id - The ID of the device.
   * @return {Promise<Device | null>} A promise that resolves to the device object or null if not found.
   */
  async findOne(id: string): Promise<Device | null> {
    return prisma.device.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        logs: true,
      },
    })
  }

  /**
   * Creates a new device record in the database.
   *
   * @param {Device} device - The device object to be created.
   * @return {Promise<Device>} - A promise that resolves to the created device object.
   */
  async create(device: Prisma.DeviceCreateInput): Promise<Device> {
    return prisma.device.create({
      data: device,
    })
  }

  /**
   * Updates a device with the specified ID.
   *
   * @param {string} id - The ID of the device to update.
   * @param {Prisma.DeviceUpdateInput} device - The updated device data.
   * @return {Promise<Device>} - A promise that resolves to the updated device.
   */
  async update(id: string, device: Prisma.DeviceUpdateInput): Promise<Device> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Device not found', 404)
    }

    return prisma.device.update({
      where: {
        id,
      },
      data: device,
    })
  }

  /**
   * Deletes a device from the database.
   *
   * @param {string} id - The ID of the device to delete.
   * @return {Promise<void>} - A promise that resolves when the device is deleted.
   */
  async delete(id: string): Promise<void> {
    if (!(await this.findOne(id))) {
      throw new HttpException('Device not found', 404)
    }

    await prisma.device.delete({
      where: {
        id,
      },
    })
  }
}

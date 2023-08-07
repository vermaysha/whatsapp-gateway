import { HttpException, Injectable } from '@nestjs/common'
import { Device, Prisma, prisma } from 'database'
import { PaginatedResult, paginate } from 'pagination'
import { DeviceListDTO } from './devices.dto'

const devicesInclude = Prisma.validator<Prisma.DeviceInclude>()({
  owner: true,
})
type DeviceFindAll = Prisma.DeviceGetPayload<{
  include: typeof devicesInclude
}>

@Injectable()
export class DevicesService {
  /**
   * Finds all devices based on the provided parameters.
   *
   * @param {DeviceListDTO} params - The parameters for the device list.
   * @return {Promise<PaginatedResult<DeviceFindAll>>} A promise that resolves to a paginated result of the found devices.
   */
  async findAll(
    params: DeviceListDTO,
  ): Promise<PaginatedResult<DeviceFindAll>> {
    const { page, perPage, order, orderBy, search } = params

    const orderQuery:
      | Prisma.DeviceOrderByWithRelationAndSearchRelevanceInput
      | undefined = search
      ? {
          _relevance: search
            ? {
                fields: ['name'],
                search,
                sort: 'desc',
              }
            : undefined,
        }
      : {
          [orderBy ?? 'createdAt']: order ?? 'desc',
        }

    return paginate<Prisma.DeviceFindManyArgs, DeviceFindAll>(
      prisma.device,
      {
        orderBy: orderQuery,
        include: devicesInclude,
      },
      {
        page,
        perPage,
      },
    )
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

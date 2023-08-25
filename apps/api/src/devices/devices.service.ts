import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Device, Prisma, prisma } from 'database'
import { PaginatedResult, paginate } from 'pagination'
import { DeviceListDTO } from './devices.dto'

@Injectable()
export class DevicesService implements OnApplicationBootstrap {
  /**
   * Asynchronously called when the application is bootstrapped.
   *
   * @return {Promise<void>} A promise that resolves when the function completes.
   */
  async onApplicationBootstrap(): Promise<void> {
    await prisma.device.updateMany({
      data: {
        status: 'close',
        stoppedAt: new Date(),
        qr: null,
      },
    })
  }

  /**
   * Retrieves a summary of devices based on the provided search criteria.
   *
   * @param {string | null} search - The search string to filter the devices. Default is null.
   * @return {Promise<Pick<Device, 'id' | 'name'>[]>} - A promise that resolves to an array of devices with only the 'id' and 'name' properties.
   */
  async summary(
    userId: string,
    search?: string | null,
  ): Promise<Pick<Device, 'id' | 'name'>[]> {
    return prisma.device.findMany({
      orderBy: {
        _relevance: search
          ? {
              fields: ['name'],
              search,
              sort: 'desc',
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
      },
      where: {
        userId,
      },
    })
  }

  /**
   * Finds all devices based on the provided parameters.
   *
   * @param {DeviceListDTO} params - The parameters for the device list.
   * @return {Promise<object[]>} A promise that resolves to a paginated result of the found devices.
   */
  async findAll(params: DeviceListDTO, userId: string) {
    const { page, perPage, order, orderBy, search } = params
    const devicesInclude = Prisma.validator<Prisma.DeviceInclude>()({
      owner: true,
    })

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

    return paginate<
      Prisma.DeviceFindManyArgs,
      Prisma.DeviceGetPayload<{
        include: typeof devicesInclude
      }>,
      undefined
    >(
      prisma.device,
      {
        orderBy: orderQuery,
        include: devicesInclude,
        where: {
          userId,
        },
      },
      {
        page,
        perPage,
      },
    )
  }

  /**
   * Retrieves a single device by its ID.
   *
   * @param {string} id - The ID of the device.
   * @return {Promise<object | null>} A promise that resolves to the device object or null if not found.
   */
  async findOne(id: string, userId: string) {
    return prisma.device.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: {
            contacts: true,
            messages: {
              where: {
                fromMe: true,
              },
            },
          },
        },
        owner: true,
        logs: {
          orderBy: {
            time: 'desc',
          },
          take: 10,
        },
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
  async update(
    id: string,
    userId: string,
    device: Prisma.DeviceUpdateInput,
  ): Promise<Device> {
    return prisma.device.update({
      where: {
        id,
        userId,
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
  async delete(id: string, userId: string): Promise<void> {
    await prisma.device.delete({
      where: {
        id,
        userId,
      },
    })
  }
}

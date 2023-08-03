import { Controller, NotFoundException, Response } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Auth } from 'src/auth/auth.decorator'
import { DevicesService } from './devices.service'
import { CreateDto, ListDto, UpdateDto } from './devices.dto'
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core'

@Controller('devices')
@Auth()
export class DevicesController {
  constructor(private deviceService: DevicesService) {}

  @TypedRoute.Get('/')
  /**
   * Retrieves and sends a list of devices based on the provided query parameters.
   *
   * @param {ListDto} query - The query parameters for filtering and pagination.
   * @param {FastifyReply} res - The response object used to send the data.
   * @return {Promise<void>} - A promise that resolves once the data is sent.
   */
  async index(@TypedQuery() query: ListDto, @Response() res: FastifyReply) {
    const data = await this.deviceService.findAll(
      query.page ?? 1,
      query.perPage ?? 10,
    )
    res.send(data)
  }

  @TypedRoute.Get('/:id')

  /**
   * Retrieves the details of a device.
   *
   * @param {string} id - The ID of the device.
   * @param {FastifyReply} res - The response object.
   * @return {Promise<void>} - Returns a promise that resolves to void.
   */
  async detail(
    @TypedParam('id', 'string') id: string,
    @Response() res: FastifyReply,
  ) {
    const data = await this.deviceService.findOne(id)

    if (!data) {
      throw new NotFoundException('Device not found')
    }

    res.send(data)
  }

  @TypedRoute.Put('/:id')
  async update(
    @TypedParam('id', 'string') id: string,
    @TypedBody() body: UpdateDto,
    @Response() res: FastifyReply,
  ) {
    const data = await this.deviceService.update(id, {
      name: body.name,
    })

    res.send({
      status: true,
      message: 'Device updated successfully',
      data,
    })
  }

  @TypedRoute.Post('/')
  async create(@TypedBody() body: CreateDto, @Response() res: FastifyReply) {
    const data = await this.deviceService.create({
      name: body.name,
    })

    res.send({
      status: true,
      message: 'Device created successfully',
      data,
    })
  }

  @TypedRoute.Delete('/:id')
  async delete(@TypedParam('id') id: string, @Response() res: FastifyReply) {
    await this.deviceService.delete(id)
    res.send({
      status: true,
      message: 'Device deleted successfully',
    })
  }
}

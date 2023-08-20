import {
  Controller,
  NotFoundException,
  Response,
  Request,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Auth } from '../auth/auth.decorator'
import { DevicesService } from './devices.service'
import {
  CreateDto,
  DeviceListDTO,
  DeviceSummaryDTO,
  UpdateDto,
} from './devices.dto'
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core'

@Controller('devices')
@Auth()
export class DevicesController {
  constructor(private deviceService: DevicesService) {}

  @TypedRoute.Get('/')
  /**
   * Retrieves and sends a list of devices based on the provided query parameters.
   *
   * @param {DeviceListDTO} query - The query parameters for filtering and pagination.
   * @param {FastifyReply} res - The response object used to send the data.
   * @return {Promise<void>} - A promise that resolves once the data is sent.
   */
  async index(
    @TypedQuery() query: DeviceListDTO,
    @Response() res: FastifyReply,
    @Request() req: FastifyRequest,
  ) {
    const data = await this.deviceService.findAll(query, req.session.user)
    res.send(data)
  }

  @TypedRoute.Get('/summary')
  /**
   * Retrieves a summary of device data based on the provided query.
   *
   * @param {DeviceSummaryDTO} query - The query object containing the search criteria.
   * @param {FastifyReply} res - The response object used to send the data.
   * @return {Promise<void>} - A promise that resolves when the data is sent.
   */
  async summary(
    @TypedQuery() query: DeviceSummaryDTO,
    @Response() res: FastifyReply,
    @Request() req: FastifyRequest,
  ) {
    const data = await this.deviceService.summary(
      req.session.user,
      query.search,
    )
    res.send({ data })
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
    @Request() req: FastifyRequest,
  ) {
    const data = await this.deviceService.findOne(id, req.session.user)

    if (!data) {
      throw new NotFoundException('Device not found')
    }

    res.send({ data })
  }

  @TypedRoute.Put('/:id')
  async update(
    @TypedParam('id', 'string') id: string,
    @TypedBody() body: UpdateDto,
    @Response() res: FastifyReply,
    @Request() req: FastifyRequest,
  ) {
    const data = await this.deviceService.update(id, req.session.user, {
      name: body.name,
    })

    res.send({
      message: 'Device updated successfully',
      data,
    })
  }

  @TypedRoute.Post('/')
  async create(
    @TypedBody() body: CreateDto,
    @Response() res: FastifyReply,
    @Request() req: FastifyRequest,
  ) {
    const data = await this.deviceService.create({
      name: body.name,
      user: {
        connect: {
          id: req.session.user,
        },
      },
    })

    res.send({
      message: 'Device created successfully',
      data,
    })
  }

  @TypedRoute.Delete('/:id')
  async delete(
    @TypedParam('id') id: string,
    @Response() res: FastifyReply,
    @Request() req: FastifyRequest,
  ) {
    await this.deviceService.delete(id, req.session.user)
    res.send({
      message: 'Device deleted successfully',
    })
  }
}

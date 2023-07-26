import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Response,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Auth } from 'src/auth/auth.decorator'
import { DevicesService } from './devices.service'
import { CreateDto, DetailDto, ListDto, UpdateDto } from './devices.dto'

@Controller('devices')
@Auth()
export class DevicesController {
  constructor(private deviceService: DevicesService) {}

  @Get('/')
  /**
   * Retrieves and sends a list of devices based on the provided query parameters.
   *
   * @param {ListDto} query - The query parameters for filtering and pagination.
   * @param {FastifyReply} res - The response object used to send the data.
   * @return {Promise<void>} - A promise that resolves once the data is sent.
   */
  async index(@Query() query: ListDto, @Response() res: FastifyReply) {
    const data = await this.deviceService.findAll(query.page, query.perPage)
    res.send(data)
  }

  @Get('/:id')
  /**
   * Retrieves the details of a device.
   *
   * @param {DetailDto} params - The parameters for retrieving the device details.
   * @param {FastifyReply} res - The response object for sending the device details.
   * @return {Promise<void>} - A promise that resolves when the device details are sent.
   */
  async detail(@Param() params: DetailDto, @Response() res: FastifyReply) {
    const data = await this.deviceService.findOne(params.id)

    if (!data) {
      throw new NotFoundException('Device not found')
    }

    res.send(data)
  }

  @Put('/:id')
  async update(
    @Param() param: DetailDto,
    @Body() body: UpdateDto,
    @Response() res: FastifyReply,
  ) {
    const data = await this.deviceService.update(param.id, {
      name: body.name,
    })

    res.send({
      status: true,
      message: 'Device updated successfully',
      data,
    })
  }

  @Post('/')
  async create(@Body() body: CreateDto, @Response() res: FastifyReply) {
    const data = await this.deviceService.create({
      name: body.name,
    })

    res.send({
      status: true,
      message: 'Device created successfully',
      data,
    })
  }

  @Delete('/:id')
  async delete(@Param() param: DetailDto, @Response() res: FastifyReply) {
    await this.deviceService.delete(param.id)
    res.send({
      status: true,
      message: 'Device deleted successfully',
    })
  }
}

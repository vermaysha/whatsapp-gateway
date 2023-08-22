import { Controller, HttpException, Req, Res } from '@nestjs/common'
import { Auth } from '../auth/auth.decorator'
import { FastifyReply, FastifyRequest } from 'fastify'
import { WhatsappsService } from './whatsapps.service'
import { TypedParam, TypedRoute } from '@nestia/core'

@Controller('whatsapp')
@Auth()
export class WhatsappsController {
  constructor(private whatsappService: WhatsappsService) {}

  @TypedRoute.Get('/start/:deviceId')
  start(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    const status = this.whatsappService.start(deviceId, req.session.user || '')

    if (!status) {
      throw new HttpException('Failed to start', 400)
    }

    res.send({
      status,
    })
  }

  @TypedRoute.Get('/stop/:deviceId')
  async stop(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
  ) {
    const status = await this.whatsappService.stop(deviceId)

    if (!status) {
      throw new HttpException('Failed to stop', 400)
    }

    res.send({
      status,
    })
  }

  @TypedRoute.Get('/restart/:deviceId')
  async restart(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    if (!(await this.whatsappService.stop(deviceId))) {
      throw new HttpException('Service not running', 400)
    }

    const status = this.whatsappService.start(deviceId, req.session.user || '')

    if (!status) {
      throw new HttpException('Failed to restart', 400)
    }

    res.send({
      status: true,
    })
  }

  @TypedRoute.Get('/memoryUsage/:deviceId')
  async memoryUsage(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
  ) {
    try {
      const memoryUsage = await this.whatsappService.memoryUsage(deviceId)
      res.send({
        data: memoryUsage,
      })
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  @TypedRoute.Get('/cpuUsage/:deviceId')
  async cpuUsage(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
  ) {
    try {
      const cpuUsage = await this.whatsappService.cpuUsage(deviceId)
      res.send({
        data: cpuUsage,
      })
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  @TypedRoute.Get('/uptime/:deviceId')
  async uptime(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
  ) {
    try {
      const uptime = await this.whatsappService.uptime(deviceId)
      res.send({
        data: uptime,
      })
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }
}

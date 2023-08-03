import { Controller, HttpException, Req, Res } from '@nestjs/common'
import { Auth } from 'src/auth/auth.decorator'
import { FastifyReply } from 'fastify'
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
  ) {
    const status = this.whatsappService.start(deviceId)
    res.send({
      status,
    })
  }

  @TypedRoute.Get('/stop/:deviceId')
  stop(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
  ) {
    const status = this.whatsappService.stop(deviceId)
    res.send({
      status,
    })
  }

  @TypedRoute.Get('/memoryUsage/:deviceId')
  async memoryUsage(
    @TypedParam('deviceId', 'string') deviceId: string,
    @Res() res: FastifyReply,
  ) {
    try {
      const status = await this.whatsappService.memoryUsage(deviceId)
      res.send({
        status,
      })
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }
}

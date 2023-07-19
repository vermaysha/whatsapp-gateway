import { Controller, Get, HttpException, Param, Req, Res } from '@nestjs/common'
import { Auth } from 'src/auth/auth.decorator'
import { DefaultDto } from './whatsapp.dto'
import { FastifyReply } from 'fastify'
import { WhatsappsService } from './whatsapps.service'

@Controller('whatsapp')
@Auth()
export class WhatsappsController {
  constructor(private whatsappService: WhatsappsService) {}

  @Get('/start/:deviceId')
  start(@Param() params: DefaultDto, @Res() res: FastifyReply) {
    const status = this.whatsappService.start(params.deviceId)
    res.send({
      status,
    })
  }

  @Get('/stop/:deviceId')
  stop(@Param() params: DefaultDto, @Res() res: FastifyReply) {
    const status = this.whatsappService.stop(params.deviceId)
    res.send({
      status,
    })
  }

  @Get('/memoryUsage/:deviceId')
  async memoryUsage(@Param() params: DefaultDto, @Res() res: FastifyReply) {
    try {
      const status = await this.whatsappService.memoryUsage(params.deviceId)
      res.send({
        status,
      })
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }
}

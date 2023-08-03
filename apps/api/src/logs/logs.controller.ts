import { TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, Res } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Auth } from 'src/auth/auth.decorator'
import { ILogsList } from './logs.dto'
import { LogsService } from './logs.service'

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Auth()
  @TypedRoute.Get('/')
  async index(@Res() res: FastifyReply, @TypedQuery() query: ILogsList) {
    const data = await this.logsService.findAll(
      query.page ?? 1,
      query.perPage ?? 10,
    )

    res.send(data)
  }
}

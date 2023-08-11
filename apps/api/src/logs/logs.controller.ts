import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { Controller, NotFoundException, Res } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Auth } from '../auth/auth.decorator'
import { ILogsList } from './logs.dto'
import { LogsService } from './logs.service'

@Auth()
@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @TypedRoute.Get('/')
  /**
   * Retrieves logs based on the provided query.
   *
   * @param {@Res()} res - The FastifyReply object used to send the response.
   * @param {@TypedQuery()} query - The query object used to filter the logs.
   * @return {Promise<void>} - A promise that resolves when the logs are retrieved and the response is sent.
   */
  async index(@Res() res: FastifyReply, @TypedQuery() query: ILogsList) {
    const data = await this.logsService.findAll(query)

    res.send(data)
  }

  @TypedRoute.Get('/:id')
  /**
   * Retrieves the detail of a log based on its ID.
   *
   * @param {FastifyReply} res - The response object for sending the log detail.
   * @param {string} id - The ID of the log to retrieve.
   * @throws {NotFoundException} If no log is found with the specified ID.
   * @return {Promise<void>} The log detail data.
   */
  async detail(@Res() res: FastifyReply, @TypedParam('id', 'uuid') id: string) {
    const data = await this.logsService.findOne(id)

    if (!data) {
      throw new NotFoundException(`Log with uuid: ${id} not found`)
    }

    res.send(data)
  }
}

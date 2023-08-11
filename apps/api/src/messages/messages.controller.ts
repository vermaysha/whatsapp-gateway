import {
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { ListDTO } from './messages.dto'
import { FastifyReply } from 'fastify'
import { join } from 'path'
import { existsSync } from 'fs'
import { Auth } from '../auth/auth.decorator'

@Controller('messages')
@Auth()
export class MessagesController {
  constructor(private messsageService: MessagesService) {}

  @TypedRoute.Get('/')
  /**
   * Retrieve a list of messages based on the provided query parameters.
   *
   * @param {@TypedQuery} query - The query parameters for filtering and pagination.
   * @return {Promise<void>} - A promise that resolves to the list of messages.
   */
  async index(@TypedQuery() query: ListDTO, @Res() res: FastifyReply) {
    const data = await this.messsageService.findAll(query)

    res.send(data)
  }

  @TypedRoute.Get('/detail/:id')
  /**
   * Retrieves a message by its ID and sends it as a response.
   *
   * @param {string} id - The ID of the message to retrieve.
   * @param {FastifyReply} res - The response object used to send the message data.
   * @return {void} The function does not return a value.
   */
  async get(@TypedParam('id', 'uuid') id: string, @Res() res: FastifyReply) {
    const data = await this.messsageService.findOne(id)

    if (!data) {
      throw new NotFoundException(`Message with uuid: ${id} not found`)
    }

    res.send(data)
  }

  @TypedRoute.Get('/media/:id')
  /**
   * Retrieves and serves media based on the provided UUID.
   *
   * @param {string} id - The unique identifier for the media.
   * @param {FastifyReply} res - The Fastify response object.
   * @throws {NotFoundException} If the media cannot be found.
   * @return {Promise<void>} Returns a promise that resolves when the media is served.
   */
  async media(@TypedParam('id', 'uuid') id: string, @Res() res: FastifyReply) {
    const data = await this.messsageService.findOne(id)

    if (!data) {
      throw new NotFoundException(`Message with uuid: ${id} not found`)
    }

    if (!data.media || !data.mediaType) {
      throw new NotFoundException(`Message with uuid: ${id} does'nt have media`)
    }

    const path = join(__dirname, '..', 'assets', data.media)

    if (existsSync(path)) return res.type(data.mediaType).sendFile(data.media)

    return res.type('image/svg+xml').sendFile('broken-image.svg')
  }
}

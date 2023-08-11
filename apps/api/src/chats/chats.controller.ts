import { Controller, NotFoundException, Res } from '@nestjs/common'
import { Auth } from '../auth/auth.decorator'
import { ChatsService } from './chats.service'
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { FastifyReply } from 'fastify'
import { DefaultDTO, IChatsList } from './chats.dto'

@Auth(true)
@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatsService) {}

  @TypedRoute.Get('/')
  /**
   * Retrieves a list of chats based on the provided query parameters.
   *
   * @param {IChatsList} query - The query parameters for filtering the chats list.
   * @param {FastifyReply} res - The response object used to send the retrieved data.
   * @return {Promise<void>} A Promise that resolves once the data is sent.
   */
  public async index(
    @TypedQuery() query: IChatsList,
    @Res() res: FastifyReply,
  ) {
    const data = await this.chatService.findAll(query)

    res.send(data)
  }

  @TypedRoute.Get('/:id')
  /**
   * Retrieves the details of a chat.
   *
   * @param {string} id - The ID of the chat.
   * @param {DefaultDTO} query - The query parameters.
   * @param {FastifyReply} res - The FastifyReply object.
   * @return {Promise<void>} - Returns a Promise that resolves with no value.
   */
  public async detail(
    @TypedParam('id', 'uuid') id: string,
    @TypedQuery() query: DefaultDTO,
    @Res() res: FastifyReply,
  ) {
    const data = await this.chatService.findOne(id, query.device)

    if (!data) {
      throw new NotFoundException(`Chat with uuid: ${id} not found`)
    }

    res.send(data)
  }
}

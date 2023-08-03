import { Controller, Res } from '@nestjs/common'
import { Auth } from 'src/auth/auth.decorator'
import { ChatsService } from './chats.service'
import { TypedQuery, TypedRoute } from '@nestia/core'
import { FastifyReply } from 'fastify'
import { IChatsList } from './chats.dto'

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatsService) {}

  @Auth()
  @TypedRoute.Get('/')
  public async index(
    @TypedQuery() query: IChatsList,
    @Res() res: FastifyReply,
  ) {
    const data = await this.chatService.findAll(
      query.page ?? 1,
      query.perPage ?? 10,
    )

    res.send(data)
  }
}

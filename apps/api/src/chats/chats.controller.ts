import { Controller } from '@nestjs/common'
import { Auth } from 'src/auth/auth.decorator'
import { ChatsService } from './chats.service'
import { TypedRoute } from '@nestia/core'

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatsService) {}

  @Auth()
  @TypedRoute.Get('/')
  public async index() {
    //
  }
}

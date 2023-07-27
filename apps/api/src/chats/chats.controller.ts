import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/auth.decorator'
import { ChatsService } from './chats.service'

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatsService) {}

  @Auth()
  @Get('/')
  public async index() {
    //
  }
}

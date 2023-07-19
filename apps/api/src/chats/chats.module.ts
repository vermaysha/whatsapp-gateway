import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'

@Module({
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}

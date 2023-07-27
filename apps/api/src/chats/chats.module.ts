import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'

@Module({
  providers: [ChatsService],
  exports: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}

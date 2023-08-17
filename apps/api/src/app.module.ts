import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { DevicesModule } from './devices/devices.module'
import { ContactsModule } from './contacts/contacts.module'
import { MessagesModule } from './messages/messages.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth/auth.guard'
import { ChatsModule } from './chats/chats.module'
import { WhatsappsModule } from './whatsapps/whatsapps.module'
import { LogsModule } from './logs/logs.module'
import { ApiTokenModule } from './api-token/api-token.module'
import { EventsModule } from './events/events.module'

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DevicesModule,
    ContactsModule,
    MessagesModule,
    ChatsModule,
    WhatsappsModule,
    LogsModule,
    ApiTokenModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

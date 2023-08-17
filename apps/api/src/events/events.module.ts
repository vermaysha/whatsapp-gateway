import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.ENCRYPTION_KEY,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}

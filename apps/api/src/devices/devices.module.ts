import { Module } from '@nestjs/common'
import { DevicesService } from './devices.service'
import { DevicesController } from './devices.controller'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'src/auth/auth.guard'

@Module({
  providers: [
    DevicesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [DevicesController],
})
export class DevicesModule {}

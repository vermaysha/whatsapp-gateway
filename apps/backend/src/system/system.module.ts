import { Module, Global } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';

@Global()
@Module({
  providers: [SystemService],
  controllers: [SystemController],
})
export class SystemModule {}

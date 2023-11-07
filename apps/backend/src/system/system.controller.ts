import { Controller, Res } from '@nestjs/common';
import { TypedRoute } from '@nestia/core';
import { Response } from 'express';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly system: SystemService) {}

  @TypedRoute.Get('/disk')
  async diskUsage(@Res() res: Response) {
    const data = await this.system.diskUsage();
    res.send(data);
  }

  @TypedRoute.Get('/memory')
  async memoryUsage(@Res() res: Response) {
    const data = await this.system.memoryUsage();
    res.send(data);
  }
}

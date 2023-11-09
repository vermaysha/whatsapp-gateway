import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request): string {
    // req.session.touch();
    // req.session.userId = 'asdhsajkd';
    console.log(req.session.user?.uuid);
    return this.appService.getHello();
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { ApiTokenService } from './api-token.service'
import {
  ApiTokenCreateDto,
  ApiTokenListDto,
  ApitTokenDetailDto,
} from './api-token.dto'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('api-token')
export class ApiTokenController {
  constructor(private apiTokenService: ApiTokenService) {}

  @Get('/')
  async index(@Query() params: ApiTokenListDto, @Res() res: FastifyReply) {
    const data = await this.apiTokenService.findAll(params.page, params.perPage)
    res.send(data)
  }

  @Get('/:id')
  async detail(@Param() params: ApitTokenDetailDto, @Res() res: FastifyReply) {
    res.send(await this.apiTokenService.findOne(params.id))
  }

  @Post('/')
  async create(
    @Body() body: ApiTokenCreateDto,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    const data = await this.apiTokenService.create({
      name: body.name,
      description: body.description,
      expiredAt: body.expiredAt,
      user: {
        connect: {
          id: req.user?.sub,
        },
      },
    })

    res.send({
      status: true,
      message: 'Device created successfully',
      data,
    })
  }

  @Delete('/:id')
  async delete(@Param() param: ApitTokenDetailDto, @Res() res: FastifyReply) {
    await this.apiTokenService.delete(param.id)
    res.send({
      status: true,
      message: 'Api Token deleted successfully',
    })
  }
}

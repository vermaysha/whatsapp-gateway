import { Controller, Req, Res } from '@nestjs/common'
import { ApiTokenService } from './api-token.service'
import { ApiTokenCreateDto, ApiTokenListDto } from './api-token.dto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core'

@Controller('api-token')
export class ApiTokenController {
  constructor(private apiTokenService: ApiTokenService) {}

  @TypedRoute.Get('/')
  async index(@TypedQuery() params: ApiTokenListDto, @Res() res: FastifyReply) {
    const data = await this.apiTokenService.findAll(
      params.page ?? 1,
      params.perPage ?? 10,
    )
    res.send(data)
  }

  @TypedRoute.Get('/:id')
  async detail(
    @TypedParam('id', 'string') id: string,
    @Res() res: FastifyReply,
  ) {
    res.send(await this.apiTokenService.findOne(id))
  }

  @TypedRoute.Post('/')
  async create(
    @TypedBody() body: ApiTokenCreateDto,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    const data = await this.apiTokenService.create({
      name: body.name,
      description: body.description,
      expiredAt: body.expiredAt,
      user: {
        connect: {
          id: req.user?.uuid,
        },
      },
    })

    res.send({
      status: true,
      message: 'Device created successfully',
      data,
    })
  }

  @TypedRoute.Delete('/:id')
  async delete(
    @TypedParam('id', 'string') id: string,
    @Res() res: FastifyReply,
  ) {
    await this.apiTokenService.delete(id)
    res.send({
      status: true,
      message: 'Api Token deleted successfully',
    })
  }
}

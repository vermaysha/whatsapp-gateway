/// <reference path="../env.d.ts" />
import '@fastify/session'
import { Controller, Req, Res } from '@nestjs/common'
import { ApiTokenService } from './api-token.service'
import { ApiTokenCreateDto, ListDTO, PaginationDTO } from './api-token.dto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { Auth } from '../auth/auth.decorator'

@Auth()
@Controller('api-token')
export class ApiTokenController {
  constructor(private apiTokenService: ApiTokenService) {}

  @TypedRoute.Get('/')
  async index(
    @TypedQuery() params: ListDTO,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    const data = await this.apiTokenService.findAll(params, req.session.user)
    res.send(data)
  }

  @TypedRoute.Get('/:id')
  async detail(@TypedParam('id', 'uuid') id: string, @Res() res: FastifyReply) {
    const data = await this.apiTokenService.findOne(id)

    res.send({
      data,
    })
  }

  @TypedRoute.Get('/history/:id')
  async history(
    @TypedParam('id', 'uuid') id: string,
    @TypedQuery() params: PaginationDTO,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    const data = await this.apiTokenService.history(
      params,
      req.session.user,
      id,
    )

    res.send(data)
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
          id: req.session.get('user'),
        },
      },
    })

    res.send({
      status: true,
      message: 'API Token has been generated',
      data,
    })
  }

  @TypedRoute.Delete('/:id')
  async delete(@TypedParam('id', 'uuid') id: string, @Res() res: FastifyReply) {
    await this.apiTokenService.delete(id)
    res.send({
      status: true,
      message: 'Api Token deleted successfully',
    })
  }
}

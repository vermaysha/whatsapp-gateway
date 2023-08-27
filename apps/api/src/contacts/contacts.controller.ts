import { Controller, NotFoundException, Req, Res } from '@nestjs/common'
import { ContactsService } from './contacts.service'
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core'
import { Auth } from '../auth/auth.decorator'
import { FastifyReply, FastifyRequest } from 'fastify'
import { DefaultDTO, ListDTO } from './contacts.dto'
import { join } from 'path'
import { existsSync } from 'fs'

@Controller('contacts')
@Auth('all')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @TypedRoute.Get('/')
  /**
   * Retrieves a list of contacts based on the provided query parameters.
   *
   * @param {@Res()} res - The response object used to send the data back to the client.
   * @param {@TypedQuery()} query - The query parameters used to filter the list of contacts.
   * @param {@Req()} req - The request object used to access session data.
   * @return {Promise<void>} - A promise that resolves when the list of contacts is sent back to the client.
   */
  async index(
    @Res() res: FastifyReply,
    @TypedQuery() query: ListDTO,
    @Req() req: FastifyRequest,
  ) {
    const data = await this.contactsService.findAll(
      query,
      req.session.get('user') || req.user.uuid,
    )

    res.send(data)
  }

  @TypedRoute.Get('/avatar/:id')
  /**
   * Retrieves and returns the avatar image for a given message ID.
   *
   * @param {FastifyRequest} req - The Fastify request object.
   * @param {FastifyReply} res - The Fastify response object.
   * @param {DefaultDTO} query - The query parameters.
   * @param {string} id - The ID of the message.
   * @return {Promise<void>} The avatar image file or a 404 error.
   */
  async avatar(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @TypedQuery() query: DefaultDTO,
    @TypedParam('id', 'uuid') id: string,
  ) {
    const data = await this.contactsService.findOne(
      id,
      query.device ?? undefined,
    )

    if (!data) {
      throw new NotFoundException(`Contact with uuid: ${id} not found`)
    }

    if (!data.avatar) {
      throw new NotFoundException(
        `Contact with uuid: ${id} does'nt have avatar`,
      )
    }

    const path = join(__dirname, '..', '..', 'assets', data.avatar)

    if (existsSync(path)) return res.type('image/jpeg').sendFile(data.avatar)

    return res.type('image/svg+xml').sendFile('broken-image.svg')
  }
}

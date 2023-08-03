import { Controller, Res } from '@nestjs/common'
import { ContactsService } from './contacts.service'
import { TypedQuery, TypedRoute } from '@nestia/core'
import { Auth } from 'src/auth/auth.decorator'
import { FastifyReply } from 'fastify'
import { IContactsList } from './contacts.dto'

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Auth()
  @TypedRoute.Get('/')
  async index(@Res() res: FastifyReply, @TypedQuery() query: IContactsList) {
    const data = await this.contactsService.findAll(
      query.page ?? 1,
      query.perPage ?? 10,
    )

    res.send(data)
  }
}

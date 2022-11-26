import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import Device from 'App/Models/Device'
import IndexValidator from 'App/Validators/Contact/IndexValidator'
import ShowValidator from 'App/Validators/Contact/ShowValidator'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ContactController {
  public async index({ response, auth, request }: HttpContextContract) {
    const { deviceId, page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    const contacts = await Contact.query()
      .where('device_id', device?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    response.ok(contacts)
  }

  public async store({}: HttpContextContract) {}

  public async show({ response, auth, request, params }: HttpContextContract) {
    const { deviceId } = await request.validate(ShowValidator)
    const { id } = await validator.validate({
      schema: schema.create({
        id: schema.number([
          rules.unsigned(),
          rules.exists({
            table: 'chats',
            column: 'id',
          }),
        ]),
      }),
      data: params,
    })

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    const contact = await Contact.query()
      .where('device_id', device?.id!)
      .where('id', id)
      .firstOrFail()

    response.ok(contact)
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}

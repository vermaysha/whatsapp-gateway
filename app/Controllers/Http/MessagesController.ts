import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import Message from 'App/Models/Message'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import IndexValidator from 'App/Validators/Message/IndexValidator'
import ShowValidator from 'App/Validators/Message/ShowValidator'

export default class MessagesController {
  public async index({ response, auth, request }: HttpContextContract) {
    const { deviceId, page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    const message = await Message.query()
      .preload('media', (media) => {
        media.select('filePath')
      })
      .where('device_id', device?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    response.ok(message)
  }

  public async store({}: HttpContextContract) {}

  public async show({ response, auth, request, params }: HttpContextContract) {
    const { deviceId } = await request.validate(ShowValidator)
    const { id } = await validator.validate({
      schema: schema.create({
        id: schema.number([
          rules.unsigned(),
          rules.exists({
            table: 'messages',
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

    const message = await Message.query()
      .preload('media')
      .where('device_id', device?.id!)
      .where('id', id)
      .firstOrFail()

    response.ok(message)
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}

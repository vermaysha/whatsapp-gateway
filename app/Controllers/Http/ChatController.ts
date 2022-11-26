import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import Device from 'App/Models/Device'
import { Whatsapp } from 'App/Services/Whatsapp'
import IndexValidator from 'App/Validators/Chat/IndexValidator'
import ShowValidator from 'App/Validators/Chat/ShowValidator'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ChatController {
  public async index({ response, auth, request }: HttpContextContract) {
    const { deviceId, page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    const contacts = await Chat.query()
      .where('device_id', device?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    response.ok(contacts)
  }

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

    const contact = await Chat.query()
      .preload('messages', (message) => {
        message.limit(10).orderBy('id', 'desc')
      })
      .where('device_id', device?.id!)
      .where('id', id)
      .firstOrFail()

    response.ok(contact)
  }

  public async sendMessage({ request, response, auth }: HttpContextContract) {
    const number = request.input('number')
    const message = request.input('message')
    const device = await Device.query()
      .where('user_id', auth.use('jwt').user?.id!)
      .where('status', 'OPEN')
      .firstOrFail()

    const wa = Whatsapp.get(device.id)

    const result = await wa?.onWhatsApp(number)

    if (result && result[0].exists === false) {
      response.unprocessableEntity({
        message: 'E_VALIDATION_FAILURE',
        errors: [
          {
            rule: 'valid',
            field: 'number',
            message: 'Phone number invalid',
          },
        ],
      })
    }

    await wa?.sendMessage(result ? result[0].jid : '', {
      text: message,
    })

    response.json({
      message: 'Message has been sent',
    })
  }

  public async sendMessageGroup({ request, response, auth }: HttpContextContract) {
    const number = request.input('number')
    const message = request.input('message')
    const device = await Device.query()
      .where('user_id', auth.use('jwt').user?.id!)
      .where('status', 'OPEN')
      .firstOrFail()

    const wa = Whatsapp.get(device.id)

    await wa?.sendMessage(`${number}@g.us`, {
      text: message,
    })

    response.json({
      message: 'Message has been sent',
    })
  }
}

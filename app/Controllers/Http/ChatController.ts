import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import { Whatsapp } from 'App/Services/Whatsapp'

export default class ChatController {
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

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import Device from 'App/Models/Device'
import { Whatsapp } from 'App/Services/Whatsapp'
import IndexValidator from 'App/Validators/Chat/IndexValidator'
import ShowValidator from 'App/Validators/Chat/ShowValidator'

export default class ChatController {
  /**
   * Get all chat by user & device
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async index({ response, auth, request }: HttpContextContract) {
    const { deviceId, page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    const chat = await Chat.query()
      .where('device_id', device?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    return response.ok(chat)
  }

  /**
   * Get single chat
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async show({ response, auth, request, params }: HttpContextContract) {
    const { deviceId } = await request.validate(ShowValidator)
    const { id } = params

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    const chat = await Chat.query()
      .preload('messages', (message) => {
        message.limit(10).orderBy('id', 'desc')
      })
      .where('device_id', device?.id!)
      .where('id', id)
      .first()

    if (!chat) {
      return response.notFound({
        message: 'Requested chat not exist',
      })
    }

    return response.ok(chat)
  }

  public async sendMessage({ request, response, auth }: HttpContextContract) {
    const number = request.input('number')
    const message = request.input('message')
    const device = await Device.query()
      .where('user_id', auth.user?.id!)
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
      .where('user_id', auth.user?.id!)
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

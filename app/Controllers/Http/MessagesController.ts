import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import Message from 'App/Models/Message'
import IndexValidator from 'App/Validators/Message/IndexValidator'
import ShowValidator from 'App/Validators/Message/ShowValidator'

export default class MessagesController {
  /**
   * Get all messages by device
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async index({ response, auth, request }: HttpContextContract) {
    const { deviceId, remoteJid, page, perPage, orderBy, direction } = await request.validate(
      IndexValidator
    )

    let device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    const messageQuery = Message.query()
      .preload('media', (media) => {
        media.select('filePath')
      })
      .where('device_id', device?.id!)
      .orderBy(orderBy ?? 'id', direction)

    if (remoteJid) {
      messageQuery.where('remote_jid', remoteJid)
    }

    const message = await messageQuery.paginate(page ?? 1, perPage ?? 10)

    return response.ok(message)
  }

  /**
   * Get single message
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async show({ response, auth, request, params }: HttpContextContract) {
    const { deviceId } = await request.validate(ShowValidator)
    const { id } = params

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    const message = await Message.query()
      .preload('media')
      .where('device_id', device?.id!)
      .where('id', id)
      .first()

    if (!message) {
      return response.notFound({
        message: 'Requested message not exist',
      })
    }

    return response.ok(message)
  }
}

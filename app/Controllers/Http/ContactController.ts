import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import Device from 'App/Models/Device'
import IndexValidator from 'App/Validators/Contact/IndexValidator'
import ShowValidator from 'App/Validators/Contact/ShowValidator'

export default class ContactController {
  /**
   * Get all contacts by device
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async index({ response, auth, request }: HttpContextContract) {
    const { deviceId, page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    const contacts = await Contact.query()
      .where('device_id', device.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    return response.ok(contacts)
  }

  /**
   * Get single contact
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

    const contact = await Contact.query().where('device_id', device?.id!).where('id', id).first()

    if (!contact) {
      return response.notFound({
        message: 'Requested contact not exist',
      })
    }

    return response.ok(contact)
  }
}

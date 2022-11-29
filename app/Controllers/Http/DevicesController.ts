import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import IndexDeviceValidator from 'App/Validators/Device/IndexDeviceValidator'
import Contact from 'App/Models/Contact'
import Message from 'App/Models/Message'
import Group from 'App/Models/Group'
import StoreDeviceValidator from 'App/Validators/Device/StoreDeviceValidator'

export default class DevicesController {
  /**
   * Get all devices data with pagination
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async index({ request, response, auth }: HttpContextContract) {
    const { page, perPage, orderBy, direction } = await request.validate(IndexDeviceValidator)

    const devices = await Device.query()
      .where('user_id', auth.use('jwt').user?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    return response.ok(devices)
  }

  /**
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async store({ request, auth, response, logger }: HttpContextContract) {
    const { description, name } = await request.validate(StoreDeviceValidator)

    try {
      const device = await Device.create({
        name,
        description,
        status: 'CLOSE',
        userId: auth.use('jwt').user?.id!,
      })

      return response.ok({
        message: 'Device data has been saved',
        device,
      })
    } catch (error) {
      logger.error('Failed to store device', error)
      return response.badRequest({
        message: 'Failed to save new device',
      })
    }
  }

  /**
   * Show single data of device
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async show({ params, response, auth }: HttpContextContract) {
    const { id } = params

    const device = await Device.query()
      .select([
        '*',
        Contact.query()
          .count('id')
          .whereColumn(`${Contact.table}.device_id`, `${Device.table}.id`)
          .limit(1)
          .as('contact_total'),
        Message.query()
          .count('id')
          .whereColumn(`${Message.table}.device_id`, `${Device.table}.id`)
          .limit(1)
          .as('message_total'),
        Group.query()
          .count('id')
          .whereColumn(`${Group.table}.device_id`, `${Device.table}.id`)
          .limit(1)
          .as('group_total'),
      ])
      .where('id', id)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    return response.ok(device)
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}

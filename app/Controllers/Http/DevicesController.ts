import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import IndexValidator from 'App/Validators/Device/IndexValidator'
import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import Contact from 'App/Models/Contact'
import Message from 'App/Models/Message'
import Group from 'App/Models/Group'

export default class DevicesController {
  /**
   * Get all devices data with pagination
   *
   * @param param0 HttpContextContract
   * @returns
   */
  public async index({ request, response, auth }: HttpContextContract) {
    const { page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const devices = await Device.query()
      .where('user_id', auth.use('jwt').user?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    return response.ok(devices)
  }

  public async store({}: HttpContextContract) {}

  /**
   * Show single data of device
   *
   * @param param0 HttpContextContact
   * @returns Promise<void>
   */
  public async show({ params, response, auth }: HttpContextContract) {
    const { id } = await validator.validate({
      schema: schema.create({
        id: schema.number([
          rules.exists({
            table: Device.table,
            column: 'id',
          }),
        ]),
      }),
      data: params,
      messages: {
        'id.exists': 'Requested devices not found',
      },
      bail: true,
    })

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

    return response.ok(device)
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import Group from 'App/Models/Group'
import IndexValidator from 'App/Validators/Group/IndexValidator'

import { validator, schema, rules } from '@ioc:Adonis/Core/Validator'
import ShowValidator from 'App/Validators/Group/ShowValidator'

export default class GroupsController {
  public async index({ response, auth, request }: HttpContextContract) {
    const { deviceId, page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const device = await Device.query()
      .where('id', deviceId)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    const groups = await Group.query()
      .where('device_id', device?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    response.ok(groups)
  }

  public async store({}: HttpContextContract) {}

  public async show({ response, auth, request, params }: HttpContextContract) {
    const { deviceId } = await request.validate(ShowValidator)
    const { id } = await validator.validate({
      schema: schema.create({
        id: schema.number([
          rules.unsigned(),
          rules.exists({
            table: 'groups',
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

    const group = await Group.query().where('device_id', device?.id!).where('id', id).firstOrFail()

    response.ok(group)
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}

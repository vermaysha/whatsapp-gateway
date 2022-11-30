import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import Group from 'App/Models/Group'
import IndexValidator from 'App/Validators/Group/IndexValidator'
import ShowValidator from 'App/Validators/Group/ShowValidator'

export default class GroupsController {
  /**
   * Get all groups by device
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

    const groups = await Group.query()
      .where('device_id', device?.id!)
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    return response.ok(groups)
  }

  /**
   * Get single group
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

    const group = await Group.query().where('device_id', device?.id!).where('id', id).first()

    if (!group) {
      return response.notFound({
        message: 'Requested group not exist',
      })
    }

    return response.ok(group)
  }
}

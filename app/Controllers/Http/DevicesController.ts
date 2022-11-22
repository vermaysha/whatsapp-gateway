import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'

export default class DevicesController {
  /**
   * Get all devices data with pagination
   *
   * @param param0 HttpContextContract
   * @returns
   */
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)

    const devices = await Device.query().paginate(page, perPage)

    return response.ok(devices)
  }
}

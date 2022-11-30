import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import { Whatsapp } from 'App/Services/Whatsapp'
import MainValidator from 'App/Validators/Service/MainValidator'

export default class ServicesController {
  /**
   * Start session
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async start({ request, response, auth }: HttpContextContract) {
    const { id } = await request.validate(MainValidator)

    const device = await Device.query()
      .where('id', id)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not found',
      })
    }

    Whatsapp.connect(device)

    return response.ok({
      message: 'Whatsapp has been started',
    })
  }

  /**
   * Stop session
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async stop({ request, response, auth }: HttpContextContract) {
    const { id } = await request.validate(MainValidator)

    const device = await Device.query()
      .where('id', id)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not found',
      })
    }

    Whatsapp.disconnect(device)

    return response.ok({
      message: 'Whatsapp has been stopped',
    })
  }

  /**
   * Restart session
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async restart({ request, response, auth }: HttpContextContract) {
    const { id } = await request.validate(MainValidator)

    const device = await Device.query()
      .where('id', id)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not found',
      })
    }

    Whatsapp.reconnect(device)

    return response.ok({
      message: 'Whatsapp has been reconnected',
    })
  }

  /**
   * Logout session
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async logout({ request, response, auth }: HttpContextContract) {
    const { id } = await request.validate(MainValidator)

    const device = await Device.query()
      .where('id', id)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not found',
      })
    }

    Whatsapp.logout(id)

    return response.ok({
      message: 'Whatsapp has been logout',
    })
  }
}

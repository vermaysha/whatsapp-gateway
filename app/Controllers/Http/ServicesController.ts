import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import { Whatsapp } from 'App/Services/Whatsapp'

export default class ServicesController {
  /**
   * Start session when no session
   *
   * @param param0 HttpContextContract
   * @returns
   */
  public async start({ request, response }: HttpContextContract) {
    const id = request.input('id')
    const device = await Device.query().where('id', id).first()
    if (!device) {
      return response.notFound({
        message: 'E_DATA_NOT_FOUND',
      })
    }

    if (!Whatsapp.get(id)) {
      Whatsapp.connect(device)
    }

    return response.ok({
      message: 'WHATSAPP_SESSION_STARTED',
    })
  }

  public async stop({ request, response }: HttpContextContract) {
    const id = request.input('id')
    const device = await Device.query().where('id', id).first()

    if (!device) {
      return response.notFound({
        message: 'E_DATA_NOT_FOUND',
      })
    }

    Whatsapp.disconnect(device)

    return response.ok({
      message: 'WHATSAPP_SESSION_STOPPED',
    })
  }

  public async restart({ request, response }: HttpContextContract) {
    const id = request.input('id')
    const device = await Device.query().where('id', id).first()
    if (!device) {
      return response.notFound({
        message: 'E_DATA_NOT_FOUND',
      })
    }

    Whatsapp.reconnect(device)

    return response.ok({
      message: 'WHATSAPP_SESSION_RESTARTED',
    })
  }

  public async logout({ request, response }: HttpContextContract) {
    const id = request.input('id')
    const device = await Device.query().where('id', id).first()
    if (!device) {
      return response.notFound({
        message: 'E_DATA_NOT_FOUND',
      })
    }

    await Whatsapp.logout(id)

    return response.ok({
      message: 'WHATSAPP_SESSION_LOGOUTED',
    })
  }
}
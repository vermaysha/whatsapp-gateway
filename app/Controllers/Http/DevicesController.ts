import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import IndexDeviceValidator from 'App/Validators/Device/IndexDeviceValidator'
import Contact from 'App/Models/Contact'
import Message from 'App/Models/Message'
import Group from 'App/Models/Group'
import StoreDeviceValidator from 'App/Validators/Device/StoreDeviceValidator'
import { Whatsapp } from 'App/Services/Whatsapp'
import Drive from '@ioc:Adonis/Core/Drive'
import MessageMedia from 'App/Models/MessageMedia'
import Chat from 'App/Models/Chat'

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

  /**
   * Update data by id
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async update({ request, params, auth, response, logger }: HttpContextContract) {
    const device = await Device.query()
      .where('id', params.id)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    const { name, description } = await request.validate(StoreDeviceValidator)

    try {
      device.name = name
      device.description = description
      await device.save()

      return response.ok({
        message: 'Device data has been updated',
        device,
      })
    } catch (error) {
      logger.error('Failed to update device', error)
      return response.badRequest({
        message: 'Failed to update new device',
      })
    }
  }

  /**
   * Delete device by id
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async destroy({ params, auth, response, logger }: HttpContextContract) {
    const device = await Device.query()
      .where('id', params.id)
      .where('user_id', auth.use('jwt').user?.id!)
      .first()

    if (!device) {
      return response.notFound({
        message: 'Requested device not exist',
      })
    }

    try {
      // Delete message media
      const messageMedias = await MessageMedia.query()
        .select('file_path')
        .whereNotNull('file_path')
        .orWhereNot('file_path', '')
      for (const media of messageMedias) {
        Drive.delete(media.filePath!)
      }

      // Delete chat photo profile
      const chats = await Chat.query()
        .select('photo_profile')
        .whereNotNull('photo_profile')
        .orWhereNot('photo_profile', '')
      for (const chat of chats) {
        Drive.delete(chat.photoProfile!)
      }

      // Delete contact photo profile
      const contacts = await Contact.query()
        .select('img_url')
        .whereNotNull('img_url')
        .orWhereNot('img_url', '')
      for (const contact of contacts) {
        Drive.delete(contact.imgUrl!)
      }

      // Delete group photo profile
      const groups = await Group.query()
        .select('photo_profile')
        .whereNotNull('photo_profile')
        .orWhereNot('photo_profile', '')
      for (const group of groups) {
        Drive.delete(group.photoProfile!)
      }

      Whatsapp.logout(device.id)

      await device.delete()

      return response.ok({
        message: 'Device data has been deleted',
      })
    } catch (error) {
      logger.error('Failed to delete device', error)
      return response.badRequest({
        message: 'Failed to delete new device',
      })
    }
  }
}

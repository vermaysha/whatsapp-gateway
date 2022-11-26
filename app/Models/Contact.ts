import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public remoteJid?: string

  @column()
  public imgUrl?: string

  @column()
  public name?: string

  @column()
  public notify?: string

  @column()
  public status?: string

  @column()
  public verifiedName?: string

  @column()
  public deviceId: number

  @belongsTo(() => Device)
  public device: BelongsTo<typeof Device>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

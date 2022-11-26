import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

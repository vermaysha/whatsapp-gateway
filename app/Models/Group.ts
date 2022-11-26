import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public remoteJid: string

  @column()
  public subject: string

  @column()
  public announce?: boolean

  @column()
  public creation?: number

  @column()
  public desc?: string

  @column()
  public descId?: string

  @column()
  public descOwner?: string

  @column()
  public ephemeralDuration?: number

  @column()
  public owner?: string

  @column()
  public restrict?: boolean

  @column()
  public size?: number

  @column()
  public subjectOwner?: string

  @column()
  public subjectTime?: number

  @column()
  public photoProfile?: string

  @column()
  public deviceId: number

  @belongsTo(() => Device)
  public device: BelongsTo<typeof Device>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

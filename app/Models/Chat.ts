import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class Chat extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public remoteJid: string

  @column()
  public archive: boolean

  @column()
  public photoProfile?: string

  @column()
  public description?: string | null

  @column()
  public displayName?: string | null

  @column()
  public mute?: number | null

  @column()
  public name?: string | null

  @column()
  public pin?: number | null

  @column()
  public readOnly: boolean

  @column()
  public unreadCount?: number | null

  @column()
  public unreadMentionCount?: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public conversationAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null
}

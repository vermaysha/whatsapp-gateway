import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Chat from './Chat'
import Contact from './Contact'
import Group from './Group'
import Message from './Message'

export default class Device extends BaseModel {
  /**
   * Serialize the `$extras` object as it is
   */
  public serializeExtras() {
    return {
      message_total: Number(this.$extras.message_total) || undefined,
      contact_total: Number(this.$extras.contact_total) || undefined,
      group_total: Number(this.$extras.group_total) || undefined,
    }
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public status: string | null

  @column()
  public qr: string | null

  @hasMany(() => Chat)
  public chats: HasMany<typeof Chat>

  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>

  @hasMany(() => Group)
  public groups: HasMany<typeof Group>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @column.dateTime()
  public connectedAt: DateTime | null

  @column.dateTime()
  public disconnectedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

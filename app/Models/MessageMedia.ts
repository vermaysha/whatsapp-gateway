import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

export default class MessageMedia extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public messageId: number | null

  @belongsTo(() => Message)
  public message: BelongsTo<typeof Message>

  @column()
  public filePath: string | null

  @column()
  public fileName: string | null

  @column()
  public pageCount: number | null

  @column()
  public mimetype: string | null

  @column()
  public fileLength: number | null

  @column()
  public height: number | null

  @column()
  public width: number | null

  @column()
  public seconds: number | null

  @column()
  public isAnimated: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null
}

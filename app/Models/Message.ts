import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import Device from './Device'
import MessageMedia from './MessageMedia'

export type MessageStatus = 'ERROR' | 'PENDING' | 'DELIVERY_ACK' | 'SERVER_ACK' | 'READ' | 'PLAYED'
export type MessageType =
  | 'audioMessage'
  | 'videoMessage'
  | 'imageMessage'
  | 'documentMessage'
  | 'stickerMessage'
  | 'locationMessage'
  | 'liveLocationMessage'
  | 'conversation'
  | 'extendedTextMessage'
  | 'protocolMessage'

export default class Message extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public keyId: string

  @column()
  public remoteJid: string

  @column()
  public fromMe: boolean

  @column()
  public participant: string | null

  @column()
  public pushName: string | null

  @column()
  public messageStatus: MessageStatus

  @column()
  public messageType: MessageType

  @column()
  public content: string | null

  @column()
  public mentionedJid: Object | null

  @column()
  public viewOnce: boolean

  @column()
  public IsForwarded: boolean

  @column()
  public thumbnail: string | null

  @column()
  public deviceId: number

  @belongsTo(() => Device)
  public device: BelongsTo<typeof Device>

  @column()
  public messageId: number | null

  @hasOne(() => Message)
  public message: HasOne<typeof Message>

  @hasOne(() => MessageMedia)
  public media: HasOne<typeof MessageMedia>

  @column.dateTime()
  public sendAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null
}

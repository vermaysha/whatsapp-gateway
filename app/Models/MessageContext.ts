import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

export default class MessageContext extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public actionLink: Object | null

  @column()
  public conversionData: Uint8Array | null

  @column()
  public conversionDelaySeconds: number | null

  @column()
  public conversionSource: string | null

  @column()
  public disappearingMode: Object | null

  @column()
  public entryPointConversionApp: string | null

  @column()
  public entryPointConversionDelaySeconds: number | null

  @column()
  public entryPointConversionSource: string | null

  @column()
  public ephemeralSettingTimestamp: Object | null

  @column()
  public ephemeralSharedSecret: Uint8Array | null

  @column()
  public expiration: number | null

  @column()
  public externalAdReply: Object | null

  @column()
  public forwardingScore: number | null

  @column()
  public groupSubject: string | null

  @column()
  public isForwarded: boolean | null

  @column()
  public mentionedJid: Object | null

  @column()
  public parentGroupJid: string | null

  @column()
  public placeholderKey: Object | null

  @column()
  public remoteJid: string | null

  @column()
  public stanzaId: string | null

  @column()
  public messageId: number | null

  @belongsTo(() => Message)
  public message: BelongsTo<typeof Message>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'
import { WAMessageStatus, WAMessageStubType } from '@adiwajshing/baileys'
import MessageContent from './MessageContent'
import MessageContext from './MessageContext'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public keyRemoteJid: string

  @column()
  public keyFromMe: boolean

  @column()
  public keyId: string

  @column()
  public keyParticipant: string | null

  @column()
  public agentId: string | null

  @column()
  public bizPrivacyStatus: number | null

  @column()
  public broadcast: boolean | null

  @column()
  public clearMedia: boolean | null

  @column()
  public duration: number | null

  @column()
  public ephemeralDuration: number | null

  @column()
  public ephemeralOffToOn: boolean | null

  @column()
  public ephemeralOutOfSync: boolean | null

  @column()
  public ephemeralStartTimestamp: Object | null

  @column()
  public finalLiveLocation: Object | null

  @column()
  public futureproofData: Uint8Array | null

  @column()
  public ignore: boolean | null

  @column()
  public keepInChat: Object | null

  @column()
  public labels: Object | null

  @column()
  public mediaCiphertextSha256: Uint8Array | null

  @column()
  public mediaData: Object | null

  @column({
    columnName: 'message_c2s_timestamp',
  })
  public messageC2STimestamp: Object | null

  @column()
  public messageSecret: Uint8Array | null

  @column()
  public messageStubParameters: Object | null

  @column()
  public messageStubType: WAMessageStubType | null

  @column()
  public messageTimestamp: Object | null

  @column()
  public multicast: boolean | null

  @column()
  public originalSelfAuthorUserJidString: string | null

  @column()
  public participant: string | null

  @column()
  public photoChange: Object | null

  @column()
  public pollAdditionalMetadata: Object | null

  @column()
  public pollUpdates: Object | null

  @column()
  public pushName: string | null

  @column()
  public quotedStickerData: Object | null

  @column()
  public reactions: Object | null

  @column()
  public revokeMessageTimestamp: Object | null

  @column()
  public starred: boolean | null

  @column()
  public status: WAMessageStatus | null

  @column()
  public statusAlreadyViewed: boolean | null

  @column()
  public urlNumber: boolean | null

  @column()
  public urlText: boolean | null

  @column()
  public userReceipt: Object | null

  @column()
  public verifiedBizName: string | null

  @column()
  public deviceId: number

  @belongsTo(() => Device)
  public device: BelongsTo<typeof Device>

  @column()
  public messageId: number | null

  @belongsTo(() => Message)
  public message: BelongsTo<typeof Message>

  @hasOne(() => MessageContent)
  public content: HasOne<typeof MessageContent>

  @hasOne(() => MessageContext)
  public context: HasOne<typeof MessageContext>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

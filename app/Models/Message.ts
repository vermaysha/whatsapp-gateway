import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public remoteJid: string

  @column()
  public fromMe: boolean

  @column()
  public keyId: string

  @column()
  public messageTimestamp: number

  @column()
  public pushName: string

  @column()
  public status: number

  @column()
  public type: string | null

  @column()
  public senderKeyHash: string

  @column()
  public senderTimestamp: number

  @column()
  public recepientKeyHash: string

  @column()
  public recipientTimestamps: number

  @column()
  public messageSecret: string | null

  @column()
  public messageType: string

  @column()
  public viewOnceMessage: boolean

  @column()
  public url: string | null

  @column()
  public mimetype: string | null

  @column()
  public title: string | null

  @column()
  public file_sha256: string | null

  @column()
  public file_length: number | null

  @column()
  public page_count: number | null

  @column()
  public media_key: string | null

  @column()
  public file_name: string | null

  @column()
  public file_enc_sha256: string | null

  @column()
  public direct_path: string | null

  @column()
  public media_key_timestamp: number | null

  @column()
  public height: number | null

  @column()
  public width: number | null

  @column()
  public jpeg_thumbnail: string | null

  @column()
  public seconds: number | null

  @column()
  public ptt: boolean | null

  @column()
  public waveform: string | null

  @column()
  public degrees_latitude: number | null

  @column()
  public display_name: number | null

  @column()
  public vcard: string | null

  @column()
  public poll_name: string | null

  @column()
  public poll_options: object | null

  @column()
  public selectable_options_count: number | null

  @column()
  public poll_remote_jid: string | null

  @column()
  public poll_from_me: boolean | null

  @column()
  public poll_id: string | null

  @column()
  public poll_enc_payload: string | null

  @column()
  public poll_enc_iv: string | null

  @column()
  public senderTimestampMs: number | null

  @column()
  public text: string | null

  @column()
  public gif_playback: boolean | null

  @column()
  public gif_attribution: string | null

  @column()
  public is_animated: boolean | null

  @column()
  public scans_sidecar: string | null

  @column()
  public scan_lengths: object | null

  @column()
  public mid_quality_file_sha256: string | null

  @column()
  public preview_type: string | null

  @column()
  public footer_text: string | null

  @column()
  public buttons: string | null

  @column()
  public header_type: string | null

  @column()
  public device_id: number

  @belongsTo(() => Device)
  public device: BelongsTo<typeof Device>

  @column()
  public message_id: number | null

  @belongsTo(() => Message)
  public message: BelongsTo<typeof Message>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

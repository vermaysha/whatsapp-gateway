import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { proto } from '@adiwajshing/baileys'
import Message from './Message'

export default class MessageContent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public messageType: string

  @column()
  public caption: string | null

  @column()
  public contactVcard: boolean | null

  @column()
  public directPath: string | null

  @column()
  public fileEncSha256: Uint8Array | null

  @column()
  public fileLength: Object | null

  @column()
  public fileName: string | null

  @column()
  public fileSha256: Uint8Array | null

  @column()
  public jpegThumbnail: Uint8Array | null

  @column()
  public mediaKey: Uint8Array | null

  @column()
  public mediaKeyTimestamp: Object | null

  @column()
  public mimetype: string | null

  @column()
  public pageCount: number | null

  @column()
  public thumbnailDirectPath: string | null

  @column()
  public thumbnailEncSha256: Uint8Array | null

  @column()
  public thumbnailHeight: number | null

  @column()
  public thumbnailSha256: Uint8Array | null

  @column()
  public thumbnailWidth: number | null

  @column()
  public title: string | null

  @column()
  public url: string | null

  @column()
  public ptt: boolean | null

  @column()
  public seconds: number | null

  @column()
  public streamingSidecar: Uint8Array | null

  @column()
  public waveform: Uint8Array | null

  @column()
  public experimentGroupId: number | null

  @column()
  public firstScanLength: number | null

  @column()
  public firstScanSidecar: Uint8Array | null

  @column()
  public height: number | null

  @column()
  public midQualityFileEncSha256: Uint8Array | null

  @column()
  public midQualityFileSha256: Uint8Array | null

  @column()
  public scanLengths: Object | null

  @column()
  public scansSidecar: Uint8Array | null

  @column()
  public staticUrl: string | null

  @column()
  public viewOnce: boolean | null

  @column()
  public width: number | null

  @column()
  public accuracyInMeters: number | null

  @column()
  public address: string | null

  @column()
  public comment: string | null

  @column()
  public degreesClockwiseFromMagneticNorth: number | null

  @column()
  public degreesLatitude: number | null

  @column()
  public degreesLongitude: number | null

  @column()
  public isLive: boolean | null

  @column()
  public name: string | null

  @column()
  public speedInMps: number | null

  @column()
  public conversation: string | null

  @column()
  public gifAttribution: proto.Message.VideoMessage.Attribution | null

  @column()
  public gifPlayback: boolean | null

  @column()
  public firstFrameLength: number | null

  @column()
  public firstFrameSidecar: Uint8Array | null

  @column()
  public isAnimated: boolean | null

  @column()
  public pngThumbnail: Uint8Array | null

  @column()
  public backgroundArgb: number | null

  @column()
  public canonicalUrl: string | null

  @column()
  public description: string | null

  @column()
  public doNotPlayInline: boolean | null

  @column()
  public font: proto.Message.ExtendedTextMessage.FontType | null

  @column()
  public inviteLinkGroupType: proto.Message.ExtendedTextMessage.InviteLinkGroupType | null

  @column()
  public inviteLinkGroupTypeV2: proto.Message.ExtendedTextMessage.InviteLinkGroupType | null

  @column()
  public inviteLinkParentGroupSubjectV2: string | null

  @column()
  public matchedText: string | null

  @column()
  public previewType: proto.Message.ExtendedTextMessage.PreviewType | null

  @column()
  public text: string | null

  @column()
  public textArgb: number | null

  @column()
  public type: proto.Message.ProtocolMessage.Type | null

  @column()
  public groupJid: string | null

  @column()
  public groupName: string | null

  @column()
  public groupType: proto.Message.GroupInviteMessage.GroupType | null

  @column()
  public inviteCode: string | null

  @column()
  public inviteExpiration: Object | null

  @column()
  public sequenceNumber: number | null

  @column()
  public timeOffset: number | null

  @column()
  public senderTimestampMs: Object | null

  @column()
  public reactionRemoteJid: string | null

  @column()
  public reactionid: string | null

  @column()
  public reactionFromMe: boolean | null

  @column()
  public reactionParticipant: string | null

  @column()
  public groupingKey: string | null

  @column()
  public messageId: number | null

  @belongsTo(() => Message)
  public message: BelongsTo<typeof Message>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

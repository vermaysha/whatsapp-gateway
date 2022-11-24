/* eslint-disable eqeqeq */
import {
  BaileysEventEmitter,
  ConnectionState,
  jidNormalizedUser,
  proto,
} from '@adiwajshing/baileys'
import Device from 'App/Models/Device'
import Message from 'App/Models/Message'

class DatabaseStore {
  protected state: ConnectionState = { connection: 'close' }

  /**
   * Bind database store
   *
   * @param ev BaileysEventEmmiter
   * @param device Device
   */
  public bind(ev: BaileysEventEmitter, device: Device) {
    ev.on('connection.update', (update) => {
      Object.assign(this.state, update)
    })

    // Save new messages
    ev.on('messages.upsert', async ({ messages, type }) => {
      switch (type) {
        case 'append':
        case 'notify':
          for (const msg of messages) {
            try {
              const { content, conversation, messageType, viewOnce } = this.getMessages(msg)

              const messageData = await this.generateMessageData(msg, content)
              const message = await Message.updateOrCreate(
                { keyId: messageData.keyId },
                messageData
              )

              const messageContextData = this.generateMessageContextData(content)
              await message.related('context').create(messageContextData)

              const messageContentData = this.generateMessageContentData(
                content,
                conversation ?? null,
                messageType,
                viewOnce
              )
              await message.related('content').create(messageContentData)

              await message.related('device').associate(device)
            } catch (error) {
              console.log(JSON.stringify(msg))
              console.error(error)
            }
          }
          break
      }
    })
  }

  /**
   * Get Messages from current event
   *
   * @param msg proto.IWebMessageInfo
   * @returns Object
   */
  protected getMessages(msg: proto.IWebMessageInfo) {
    let content: any
    let messageType: string = ''
    let conversation: string | null | undefined
    let viewOnce: boolean = false

    if (
      msg.message?.ephemeralMessage?.message?.audioMessage ||
      msg.message?.viewOnceMessageV2?.message?.audioMessage ||
      msg.message?.viewOnceMessage?.message?.audioMessage ||
      msg.message?.audioMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.audioMessage ||
        msg.message.viewOnceMessageV2?.message?.audioMessage ||
        msg.message.viewOnceMessage?.message?.audioMessage ||
        msg.message.audioMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.audioMessage != undefined ||
        msg.message.viewOnceMessage?.message?.audioMessage != undefined

      messageType = 'audioMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.documentMessage ||
      msg.message?.viewOnceMessageV2?.message?.documentMessage ||
      msg.message?.viewOnceMessage?.message?.documentMessage ||
      msg.message?.documentMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.documentMessage ||
        msg.message.viewOnceMessageV2?.message?.documentMessage ||
        msg.message.viewOnceMessage?.message?.documentMessage ||
        msg.message.documentMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.documentMessage != undefined ||
        msg.message.viewOnceMessage?.message?.documentMessage != undefined

      messageType = 'documentMessage'
    } else if (
      msg.message?.viewOnceMessageV2?.message?.imageMessage ||
      msg.message?.viewOnceMessage?.message?.imageMessage ||
      msg.message?.imageMessage
    ) {
      content =
        msg.message?.viewOnceMessageV2?.message?.imageMessage ||
        msg.message?.viewOnceMessage?.message?.imageMessage ||
        msg.message?.imageMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.imageMessage != undefined ||
        msg.message.viewOnceMessage?.message?.imageMessage != undefined

      messageType = 'imageMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.locationMessage ||
      msg.message?.viewOnceMessageV2?.message?.locationMessage ||
      msg.message?.viewOnceMessage?.message?.locationMessage ||
      msg.message?.locationMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.locationMessage ||
        msg.message?.viewOnceMessageV2?.message?.locationMessage ||
        msg.message?.viewOnceMessage?.message?.locationMessage ||
        msg.message?.locationMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.locationMessage != undefined ||
        msg.message.viewOnceMessage?.message?.locationMessage != undefined

      messageType = 'locationMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.conversation ||
      msg.message?.viewOnceMessageV2?.message?.conversation ||
      msg.message?.viewOnceMessage?.message?.conversation ||
      msg.message?.conversation
    ) {
      conversation =
        msg.message?.ephemeralMessage?.message?.conversation ||
        msg.message?.viewOnceMessageV2?.message?.conversation ||
        msg.message?.viewOnceMessage?.message?.conversation ||
        msg.message?.conversation

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.conversation != undefined ||
        msg.message.viewOnceMessage?.message?.conversation != undefined

      messageType = 'conversation'
    } else if (
      msg.message?.ephemeralMessage?.message?.videoMessage ||
      msg.message?.viewOnceMessageV2?.message?.videoMessage ||
      msg.message?.viewOnceMessage?.message?.videoMessage ||
      msg.message?.videoMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.videoMessage ||
        msg.message?.viewOnceMessageV2?.message?.videoMessage ||
        msg.message?.viewOnceMessage?.message?.videoMessage ||
        msg.message?.videoMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.videoMessage != undefined ||
        msg.message.viewOnceMessage?.message?.videoMessage != undefined

      messageType = 'videoMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.stickerMessage ||
      msg.message?.viewOnceMessageV2?.message?.stickerMessage ||
      msg.message?.viewOnceMessage?.message?.stickerMessage ||
      msg.message?.stickerMessage
    ) {
      content =
        msg.message.ephemeralMessage?.message?.stickerMessage ||
        msg.message.viewOnceMessageV2?.message?.stickerMessage ||
        msg.message.viewOnceMessage?.message?.stickerMessage ||
        msg.message.stickerMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.stickerMessage != undefined ||
        msg.message.viewOnceMessage?.message?.stickerMessage != undefined

      messageType = 'stickerMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.extendedTextMessage ||
      msg.message?.viewOnceMessageV2?.message?.extendedTextMessage ||
      msg.message?.viewOnceMessage?.message?.extendedTextMessage ||
      msg.message?.extendedTextMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.extendedTextMessage ||
        msg.message?.viewOnceMessageV2?.message?.extendedTextMessage ||
        msg.message?.viewOnceMessage?.message?.extendedTextMessage ||
        msg.message?.extendedTextMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.extendedTextMessage != undefined ||
        msg.message.viewOnceMessage?.message?.extendedTextMessage != undefined

      messageType = 'extendedTextMessage'
    } else if (
      msg.message?.viewOnceMessageV2?.message?.protocolMessage ||
      msg.message?.viewOnceMessage?.message?.protocolMessage ||
      msg.message?.protocolMessage
    ) {
      content =
        msg.message?.viewOnceMessageV2?.message?.protocolMessage ||
        msg.message?.viewOnceMessage?.message?.protocolMessage ||
        msg.message?.protocolMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.protocolMessage != undefined ||
        msg.message.viewOnceMessage?.message?.protocolMessage != undefined

      messageType = 'protocolMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.groupInviteMessage ||
      msg.message?.viewOnceMessageV2?.message?.groupInviteMessage ||
      msg.message?.viewOnceMessage?.message?.groupInviteMessage ||
      msg.message?.groupInviteMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.groupInviteMessage ||
        msg.message?.viewOnceMessageV2?.message?.groupInviteMessage ||
        msg.message?.viewOnceMessage?.message?.groupInviteMessage ||
        msg.message?.groupInviteMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.groupInviteMessage != undefined ||
        msg.message.viewOnceMessage?.message?.groupInviteMessage != undefined

      messageType = 'groupInviteMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.liveLocationMessage ||
      msg.message?.viewOnceMessageV2?.message?.liveLocationMessage ||
      msg.message?.viewOnceMessage?.message?.liveLocationMessage ||
      msg.message?.liveLocationMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.liveLocationMessage ||
        msg.message?.viewOnceMessageV2?.message?.liveLocationMessage ||
        msg.message?.viewOnceMessage?.message?.liveLocationMessage ||
        msg.message?.liveLocationMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.liveLocationMessage != undefined ||
        msg.message.viewOnceMessage?.message?.liveLocationMessage != undefined

      messageType = 'liveLocationMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.reactionMessage ||
      msg.message?.viewOnceMessageV2?.message?.reactionMessage ||
      msg.message?.viewOnceMessage?.message?.reactionMessage ||
      msg.message?.reactionMessage
    ) {
      content =
        msg.message?.ephemeralMessage?.message?.reactionMessage ||
        msg.message?.viewOnceMessageV2?.message?.reactionMessage ||
        msg.message?.viewOnceMessage?.message?.reactionMessage ||
        msg.message?.reactionMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.reactionMessage != undefined ||
        msg.message.viewOnceMessage?.message?.reactionMessage != undefined

      messageType = 'reactionMessage'
    }

    return {
      content,
      messageType,
      conversation: conversation ?? null,
      viewOnce,
    }
  }

  /**
   * Generate Message Data for insert to db
   *
   * @param msg proto.IWebMessageInfo
   * @param content any
   * @returns Object
   */
  protected async generateMessageData(msg: proto.IWebMessageInfo, content: any) {
    const jid = jidNormalizedUser(msg.key.remoteJid!)
    let messageId: number | null = null

    if (content?.contextInfo?.stanzaId) {
      const parent = await Message.findBy('key_id', content?.contextInfo?.stanzaId)
      messageId = parent?.id ?? null
    }

    return {
      keyRemoteJid: jid,
      keyFromMe: msg.key.fromMe!,
      keyId: msg.key.id!,
      keyParticipant: msg.key.participant ?? null,
      bizPrivacyStatus: msg.bizPrivacyStatus ?? null,
      broadcast: msg.broadcast ?? null,
      clearMedia: msg.clearMedia ?? null,
      duration: msg.duration ?? null,
      ephemeralDuration: msg.ephemeralDuration ?? null,
      ephemeralOffToOn: msg.ephemeralOffToOn ?? null,
      ephemeralOutOfSync: msg.ephemeralOutOfSync ?? null,
      ephemeralStartTimestamp: JSON.stringify(msg.ephemeralStartTimestamp ?? null),
      finalLiveLocation: JSON.stringify(msg.finalLiveLocation ?? null),
      futureproofData: msg.futureproofData ?? null,
      ignore: msg.ignore ?? null,
      keepInChat: JSON.stringify(msg.keepInChat ?? null),
      labels: JSON.stringify(msg.labels ?? null),
      mediaCiphertextSha256: msg.mediaCiphertextSha256 ?? null,
      mediaData: JSON.stringify(msg.mediaData ?? null),
      messageC2STimestamp: JSON.stringify(msg.messageC2STimestamp ?? null),
      messageSecret: msg.messageSecret ?? null,
      messageStubParameters: JSON.stringify(msg.messageStubParameters ?? null),
      messageStubType: msg.messageStubType ?? null,
      messageTimestamp: JSON.stringify(msg.messageTimestamp ?? null),
      multicast: msg.multicast ?? null,
      originalSelfAuthorUserJidString: msg.originalSelfAuthorUserJidString ?? null,
      participant: msg.participant ?? null,
      photoChange: JSON.stringify(msg.photoChange ?? null),
      pollAdditionalMetadata: JSON.stringify(msg.pollAdditionalMetadata ?? null),
      pollUpdates: JSON.stringify(msg.pollUpdates ?? null),
      pushName: msg.pushName ?? null,
      quotedStickerData: JSON.stringify(msg.quotedStickerData ?? null),
      reactions: JSON.stringify(msg.reactions ?? null),
      revokeMessageTimestamp: JSON.stringify(msg.revokeMessageTimestamp ?? null),
      starred: msg.starred ?? null,
      status: msg.status ?? null,
      statusAlreadyViewed: msg.statusAlreadyViewed ?? null,
      urlNumber: msg.urlNumber ?? null,
      urlText: msg.urlText ?? null,
      userReceipt: JSON.stringify(msg.userReceipt ?? null),
      verifiedBizName: msg.agentId ?? null,
      messageId: messageId,
    }
  }

  /**
   * Generate Message Context Data for inserting to db
   *
   * @param content any
   * @returns Object
   */
  protected generateMessageContextData(content: any) {
    return {
      actionLink: JSON.stringify(content?.contextInfo?.actionLink ?? null),
      conversionData: content?.contextInfo?.conversionData ?? null,
      conversionDelaySeconds: content?.contextInfo?.conversionDelaySeconds ?? null,
      conversionSource: content?.contextInfo?.conversionSource ?? null,
      disappearingMode: JSON.stringify(content?.contextInfo?.disappearingMode ?? null),
      entryPointConversionApp: content?.contextInfo?.entryPointConversionApp ?? null,
      entryPointConversionDelaySeconds:
        content?.contextInfo?.entryPointConversionDelaySeconds ?? null,
      entryPointConversionSource: content?.contextInfo?.entryPointConversionSource ?? null,
      ephemeralSettingTimestamp: JSON.stringify(
        content?.contextInfo?.ephemeralSettingTimestamp ?? null
      ),
      ephemeralSharedSecret: content?.contextInfo?.ephemeralSharedSecret ?? null,
      expiration: content?.contextInfo?.expiration ?? null,
      externalAdReply: JSON.stringify(content?.contextInfo?.externalAdReply ?? null),
      forwardingScore: content?.contextInfo?.forwardingScore ?? null,
      groupSubject: content?.contextInfo?.groupSubject ?? null,
      isForwarded: content?.contextInfo?.isForwarded ?? null,
      mentionedJid: JSON.stringify(content?.contextInfo?.mentionedJid ?? null),
      parentGroupJid: content?.contextInfo?.parentGroupJid ?? null,
      placeholderKey: JSON.stringify(content?.contextInfo?.placeholderKey ?? null),
      remoteJid: content?.contextInfo?.remoteJid ?? null,
      stanzaId: content?.contextInfo?.stanzaId ?? null,
    }
  }

  /**
   * Generate message content data for inserting to db
   * @param content any
   * @param conversation string | null
   * @param messageType string
   * @param viewOnce boolean
   * @returns Object
   */
  protected generateMessageContentData(
    content: any,
    conversation: string | null,
    messageType: string,
    viewOnce: boolean
  ) {
    return {
      conversation: conversation,
      messageType: messageType,
      caption: content?.caption ?? null,
      contactVcard: content?.contactVcard ?? null,
      directPath: content?.directPath ?? null,
      fileEncSha256: content?.fileEncSha256 ?? null,
      fileLength: JSON.stringify(content?.fileLength ?? null),
      fileName: content?.fileName ?? null,
      fileSha256: content?.fileSha256 ?? null,
      jpegThumbnail: content?.jpegThumbnail ?? null,
      mediaKey: content?.mediaKey ?? null,
      mediaKeyTimestamp: JSON.stringify(content?.mediaKeyTimestamp ?? null),
      mimetype: content?.mimetype ?? null,
      pageCount: content?.pageCount ?? null,
      thumbnailDirectPath: content?.thumbnailDirectPath ?? null,
      thumbnailEncSha256: content?.thumbnailEncSha256 ?? null,
      thumbnailHeight: content?.thumbnailHeight ?? null,
      thumbnailSha256: content?.thumbnailSha256 ?? null,
      thumbnailWidth: content?.thumbnailWidth ?? null,
      title: content?.title ?? null,
      url: content?.url ?? null,
      ptt: content?.ptt ?? null,
      seconds: content?.seconds ?? null,
      streamingSidecar: content?.streamingSidecar ?? null,
      waveform: content?.waveform ?? null,
      experimentGroupId: content?.experimentGroupId ?? null,
      firstScanLength: content?.firstScanLength ?? null,
      firstScanSidecar: content?.firstScanSidecar ?? null,
      height: content?.height ?? null,
      midQualityFileEncSha256: content?.midQualityFileEncSha256 ?? null,
      midQualityFileSha256: content?.midQualityFileSha256 ?? null,
      scanLengths: JSON.stringify(content?.scanLengths ?? null),
      scansSidecar: content?.scansSidecar ?? null,
      staticUrl: content?.staticUrl ?? null,
      viewOnce: content?.viewOnce || viewOnce,
      width: content?.width ?? null,
      accuracyInMeters: content?.accuracyInMeters ?? null,
      address: content?.address ?? null,
      comment: content?.comment ?? null,
      degreesClockwiseFromMagneticNorth: content?.degreesClockwiseFromMagneticNorth ?? null,
      degreesLatitude: content?.degreesLatitude ?? null,
      degreesLongitude: content?.degreesLongitude ?? null,
      isLive: content?.isLive ?? null,
      name: content?.name ?? null,
      speedInMps: content?.speedInMps ?? null,
      gifAttribution: content?.gifAttribution ?? null,
      gifPlayback: content?.gifPlayback ?? null,
      firstFrameLength: content?.firstFrameLength ?? null,
      firstFrameSidecar: content?.firstFrameSidecar ?? null,
      isAnimated: content?.isAnimated ?? null,
      pngThumbnail: content?.pngThumbnail ?? null,
      backgroundArgb: content?.backgroundArgb ?? null,
      canonicalUrl: content?.canonicalUrl ?? null,
      description: content?.description ?? null,
      doNotPlayInline: content?.doNotPlayInline ?? null,
      font: content?.font ?? null,
      inviteLinkGroupType: content?.inviteLinkGroupType ?? null,
      inviteLinkGroupTypeV2: content?.inviteLinkGroupTypeV2 ?? null,
      inviteLinkParentGroupSubjectV2: content?.inviteLinkParentGroupSubjectV2 ?? null,
      matchedText: content?.matchedText ?? null,
      previewType: content?.previewType ?? null,
      text: content?.text ?? null,
      textArgb: content?.textArgb ?? null,
      type: content?.type ?? null,
      groupJid: content?.groupJid ?? null,
      groupName: content?.groupName ?? null,
      groupType: content?.groupType ?? null,
      inviteCode: content?.inviteCode ?? null,
      inviteExpiration: JSON.stringify(content?.inviteExpiration ?? null),
      sequenceNumber: content?.sequenceNumber ?? null,
      timeOffset: content?.timeOffset ?? null,
      senderTimestampMs: JSON.stringify(content?.senderTimestampMs ?? null),
      reactionRemoteJid: content?.reactionRemoteJid ?? null,
      reactionid: content?.reactionid ?? null,
      reactionFromMe: content?.reactionFromMe ?? null,
      reactionParticipant: content?.reactionParticipant ?? null,
      groupingKey: content?.groupingKey ?? null,
    }
  }
}

export default new DatabaseStore()

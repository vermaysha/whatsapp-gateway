/* eslint-disable eqeqeq */
import makeWASocket, {
  Chat,
  ConnectionState,
  Contact,
  downloadMediaMessage,
  GroupMetadata,
  isJidGroup,
  jidNormalizedUser,
  proto,
  WAMessageUpdate,
} from '@adiwajshing/baileys'
import Message, { MessageStatus, MessageType } from 'App/Models/Message'
import { DateTime } from 'luxon'
import { Logger, LoggerOptions } from 'pino'
import Mime from 'mime'
import md5 from 'md5'
import { PathLike } from 'fs'
import ChatModel from 'App/Models/Chat'
import ContactModel from 'App/Models/Contact'
import GroupModel from 'App/Models/Group'
import axios from 'axios'
import Drive from '@ioc:Adonis/Core/Drive'
import { Readable } from 'stream'

class WhatsappStore {
  protected state: ConnectionState = { connection: 'close' }

  /**
   * Bind database store
   *
   * @param sock BaileysEventEmmiter
   * @param device Device
   */
  public bind(
    sock: ReturnType<typeof makeWASocket>,
    logger: Logger<LoggerOptions>,
    deviceId: number
  ) {
    sock.ev.on('connection.update', (update) => {
      Object.assign(this.state, update)
    })

    // Save new messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
      this.messageUpsert(messages, sock, logger, deviceId)
    })

    sock.ev.on('messages.update', async (messages) => {
      this.messageUpdate(messages, logger)
    })

    sock.ev.on('messages.delete', async (item) => {
      if ('all' in item) {
        await Message.query()
          .where({ remoteJid: jidNormalizedUser(item.jid) })
          .update({
            deletedAt: DateTime.now(),
          })
      } else {
        await Message.query()
          .where({ remoteJid: jidNormalizedUser(item.keys[0].remoteJid!) })
          .limit(1)
          .update({
            deletedAt: DateTime.now(),
          })
      }
    })

    sock.ev.on('chats.upsert', (chats) => {
      this.chats(chats, sock, logger, deviceId)
    })

    sock.ev.on('chats.update', (chats) => {
      this.chats(chats, sock, logger, deviceId)
    })

    sock.ev.on('chats.delete', async (remoteJid) => {
      ;(await ChatModel.findBy('remote_jid', remoteJid))?.delete()
    })

    sock.ev.on('contacts.upsert', (contacts) => {
      this.contacts(contacts, sock, logger, deviceId)
    })

    sock.ev.on('contacts.update', (contacts) => {
      this.contacts(contacts, sock, logger, deviceId)
    })

    sock.ev.on('groups.update', (groups) => {
      this.groups(groups, sock, logger, deviceId)
    })

    sock.ev.on('groups.upsert', (groups) => {
      this.groups(groups, sock, logger, deviceId)
    })
  }

  /**
   * Message upsert
   *
   * @param messages proto.IWebMessageInfo[]
   * @param sock ReturnType<typeof makeWASocket>
   * @param logger Logger<LoggerOptions>
   * @param deviceId number
   * @returns Promise<void>
   */
  protected async messageUpsert(
    messages: proto.IWebMessageInfo[],
    sock: ReturnType<typeof makeWASocket>,
    logger: Logger<LoggerOptions>,
    deviceId: number
  ) {
    for (const msg of messages) {
      const { messageType, message, content } = this.getMessages(msg)

      // Skipping when its protocolMessage
      if (messageType === 'protocolMessage' || messageType == null) {
        return
      }

      let messageId: number | undefined | null

      if (message?.contextInfo?.stanzaId) {
        messageId = (await Message.findBy('keyId', message.contextInfo.stanzaId))?.id
      }

      if (msg.key.id && msg.key.remoteJid) {
        const normalizeJid = jidNormalizedUser(msg.key.remoteJid)
        // Save new Groups
        if (isJidGroup(normalizeJid)) {
          const isExists = await GroupModel.findBy('remote_jid', normalizeJid)
          if (isExists === null) {
            const groupMetaData = await sock.groupMetadata(normalizeJid)
            let ppPath: string | undefined

            try {
              const ppUrl = await sock.profilePictureUrl(normalizeJid, 'image')
              if (ppUrl) {
                await this.download(ppUrl, `device-${deviceId}/${normalizeJid}/photoProfile.jpg`)
                ppPath = `device-${deviceId}/${normalizeJid}/photoProfile.jpg`
              }
            } catch {}

            try {
              await GroupModel.updateOrCreate(
                {
                  remoteJid: normalizeJid,
                  deviceId: deviceId,
                },
                {
                  deviceId: deviceId,
                  remoteJid: normalizeJid,
                  subject: groupMetaData.subject,
                  announce: groupMetaData.announce,
                  creation: groupMetaData.creation,
                  desc: groupMetaData.desc,
                  descId: groupMetaData.descId,
                  descOwner: groupMetaData.descOwner,
                  ephemeralDuration: groupMetaData.ephemeralDuration,
                  owner: groupMetaData.owner,
                  restrict: groupMetaData.restrict,
                  size: groupMetaData.size,
                  subjectOwner: groupMetaData.subjectOwner,
                  subjectTime: groupMetaData.subjectTime,
                  photoProfile: ppPath,
                }
              )
            } catch (error) {
              logger.error(groupMetaData, `Failed to save group metadata: ${error}`)
            }
          }
        }

        try {
          const messageModel = await Message.updateOrCreate(
            {
              keyId: msg.key.id,
            },
            {
              keyId: msg.key.id,
              remoteJid: normalizeJid,
              fromMe: msg.key.fromMe ?? false,
              participant: msg.key.participant,
              pushName: msg.pushName,
              messageStatus: this.getMessageStatus(msg.status),
              messageType: messageType,
              content: content,
              mentionedJid: JSON.stringify(message?.contextInfo?.mentionedJid ?? []),
              viewOnce: message?.viewOnce ?? false,
              IsForwarded: message?.contextInfo?.isForwarded ?? false,
              deviceId: deviceId,
              messageId: messageId ?? null,
              sendAt: DateTime.fromSeconds(msg.messageTimestamp),
            }
          )

          if (msg && ['extendedTextMessage', 'conversation'].includes(messageType) === false) {
            const buffer = await downloadMediaMessage(
              msg,
              'buffer',
              {},
              {
                logger: logger,
                reuploadRequest: sock.updateMediaMessage,
              }
            )

            if (buffer) {
              const ext = Mime.getExtension(message?.mimetype ?? '')
              const fileName = md5(msg.key.id)
              const filePath = `device-${deviceId}/${normalizeJid}/${ext}/${fileName}.${ext}`

              await messageModel.related('media').updateOrCreate(
                {
                  messageId: messageModel.id,
                  deviceId: deviceId,
                },
                {
                  deviceId: deviceId,
                  fileLength: JSON.parse(message?.fileLength),
                  fileName: message?.fileName,
                  filePath: filePath,
                  height: message?.height,
                  width: message?.width,
                  isAnimated: message?.isAnimated ?? false,
                  mimetype: message?.mimetype,
                  pageCount: message?.pageCount,
                  seconds: message?.seconds,
                }
              )
              await Drive.putStream(filePath, Readable.from(buffer))
            }
          }
        } catch (error) {
          logger.error(msg, `Failed to save group metadata: ${error}`)
        }
      }
    }
  }

  /**
   * Message Updated
   *
   * @param messages WAMessageUpdate[]
   * @param logger Logger<LoggerOptions>
   * @returns Promise<void>
   */
  protected async messageUpdate(messages: WAMessageUpdate[], logger: Logger<LoggerOptions>) {
    for (const msg of messages) {
      try {
        const { message } = this.getMessages(msg.update)

        if (msg.key.id && msg.key.remoteJid) {
          if (
            msg.update.messageStubType == proto.WebMessageInfo.StubType.REVOKE ||
            message?.type == proto.Message.ProtocolMessage.Type.REVOKE
          ) {
            ;(await Message.findBy('keyId', msg.key.id))?.delete()
          }

          await Message.query()
            .where({
              keyId: msg.key.id,
            })
            .update({
              remoteJid: jidNormalizedUser(msg.key.remoteJid),
              messageStatus: this.getMessageStatus(msg.update.status),
            })
        }
      } catch (error) {
        logger.error(msg, `Failed to save message: ${error}`)
      }
    }
  }

  /**
   * Groups
   * @param groups Partial<GroupMetadata>[]
   * @param sock ReturnType<typeof makeWASocket>
   * @param logger Logger<LoggerOptions>
   * @returns void
   */
  protected async groups(
    groups: Partial<GroupMetadata>[],
    sock: ReturnType<typeof makeWASocket>,
    logger: Logger<LoggerOptions>,
    deviceId: number
  ) {
    for (const group of groups) {
      if (!group.id) {
        return
      }

      const normalizeJid = jidNormalizedUser(group.id)
      const groupMetaData = await sock.groupMetadata(normalizeJid)
      let ppPath: string | undefined

      try {
        const ppUrl = await sock.profilePictureUrl(normalizeJid, 'image')
        if (ppUrl) {
          await this.download(ppUrl, `device-${deviceId}/${normalizeJid}/photoProfile.jpg`)
          ppPath = `device-${deviceId}/${normalizeJid}/photoProfile.jpg`
        }
      } catch {}

      try {
        const updatePayload: { [k: string]: any } = {}
        const updatedColumns = [
          'subject',
          'announce',
          'creation',
          'desc',
          'descId',
          'descOwner',
          'ephemeralDuration',
          'owner',
          'restrict',
          'size',
          'subjectOwner',
          'subjectTime',
        ]

        for (const column of updatedColumns) {
          if (groupMetaData[column]) {
            updatePayload[column] = groupMetaData[column]
          }
        }

        updatePayload['remoteJid'] = normalizeJid
        updatePayload['deviceId'] = deviceId

        if (ppPath) {
          updatePayload['photoProfile'] = ppPath
        }

        await GroupModel.updateOrCreate(
          {
            remoteJid: normalizeJid,
            deviceId: deviceId,
          },
          updatePayload
        )
      } catch (error) {
        logger.error({}, `Failed to save group: ${error}`)
      }
    }
  }

  /**
   * Contacts
   *
   * @param contacts Partial<Contact>[]
   * @returns void
   */
  protected async contacts(
    contacts: Partial<Contact>[],
    sock: ReturnType<typeof makeWASocket>,
    logger: Logger<LoggerOptions>,
    deviceId: number
  ) {
    for (const contact of contacts) {
      if (!contact.id) {
        return
      }

      const normalizeJid = jidNormalizedUser(contact.id)
      let imgUrl: string | undefined

      try {
        const ppUrl = await sock.profilePictureUrl(contact.id, 'image')
        const downloadUrl = contact.imgUrl || ppUrl
        if (downloadUrl) {
          await this.download(downloadUrl, `device-${deviceId}/${normalizeJid}/photoProfile.jpg`)
          imgUrl = `device-${deviceId}/${normalizeJid}/photoProfile.jpg`
        }
      } catch (err) {}

      try {
        const updatePayload: { [k: string]: any } = {}
        const updatedColumns = ['name', 'notify', 'status', 'verifiedName']

        for (const column of updatedColumns) {
          if (contact[column]) {
            updatePayload[column] = contact[column]
          }
        }

        updatePayload['remoteJid'] = normalizeJid
        updatePayload['deviceId'] = deviceId

        if (imgUrl) {
          updatePayload['imgUrl'] = imgUrl
        }

        await ContactModel.updateOrCreate(
          {
            remoteJid: normalizeJid,
            deviceId: deviceId,
          },
          updatePayload
        )
      } catch (error) {
        logger.error(contact, `Failed to save contact: ${error}`)
      }
    }
  }

  /**
   * Chats
   * @param chats Partial<Chat>[]
   * @returns void
   */
  protected async chats(
    chats: Partial<Chat>[],
    sock: ReturnType<typeof makeWASocket>,
    logger: Logger<LoggerOptions>,
    deviceId: number
  ) {
    for (const chat of chats) {
      if (!chat.id) {
        return
      }

      let photoProfile: string | undefined

      try {
        const ppUrl = await sock.profilePictureUrl(chat.id, 'image')
        if (ppUrl) {
          await this.download(ppUrl, `device-${deviceId}/${chat.id}/photoProfile.jpg`)
          photoProfile = `device-${deviceId}/${chat.id}/photoProfile.jpg`
        }
      } catch {}

      try {
        const updatePayload: { [k: string]: any } = {}
        const updatedColumns = [
          'remoteJid',
          'archive',
          'description',
          'displayName',
          'mute',
          'name',
          'pin',
          'readOnly',
          'unreadCount',
        ]

        for (const column of updatedColumns) {
          if (chat[column]) {
            updatePayload[column] = chat[column]
          }
        }

        updatePayload['deviceId'] = deviceId

        if (chat.conversationTimestamp) {
          updatePayload['conversationAt'] = DateTime.fromSeconds(chat.conversationTimestamp)
        }

        if (photoProfile) {
          updatePayload['photoProfile'] = photoProfile
        }

        await ChatModel.updateOrCreate(
          {
            remoteJid: chat.id,
            deviceId: deviceId,
          },
          updatePayload
        )
      } catch (error) {
        logger.error(chat, `Failed to save group chat: ${error}`)
      }
    }
  }

  /**
   * Download
   *
   * @param url Url
   * @param path Path
   * @returns Promise<void>
   */
  protected async download(url: string, path: PathLike) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    })

    await Drive.putStream(path.toString(), Readable.from(response.data))
  }

  /**
   * Get Message Status
   *
   * @param status proto.WebMessageInfo.Status | null | undefined
   * @returns MessageStatus
   */
  protected getMessageStatus(
    status: proto.WebMessageInfo.Status | null | undefined
  ): MessageStatus {
    let messageStatus: MessageStatus
    switch (status) {
      case 0:
        messageStatus = 'ERROR'
        break

      case 1:
        messageStatus = 'PENDING'
        break

      case 2:
        messageStatus = 'SERVER_ACK'
        break

      case 3:
      default:
        messageStatus = 'DELIVERY_ACK'
        break

      case 4:
        messageStatus = 'READ'
        break

      case 5:
        messageStatus = 'PLAYED'
        break
    }

    return messageStatus
  }

  /**
   * Get Messages from current event
   *
   * @param msg proto.IWebMessageInfo
   * @returns Object
   */
  protected getMessages(msg: Partial<proto.IWebMessageInfo>) {
    let message:
      | Partial<
          proto.Message.IAudioMessage &
            proto.Message.IProtocolMessage &
            proto.Message.IImageMessage &
            proto.Message.IVideoMessage &
            proto.Message.IStickerMessage &
            proto.Message.IExtendedTextMessage &
            proto.Message.IDocumentMessage &
            proto.Message.ILocationMessage &
            proto.Message.ILiveLocationMessage
        >
      | null
      | undefined

    let messageType: MessageType | undefined
    let content: string | null | undefined
    let viewOnce: boolean = false

    if (
      msg.message?.ephemeralMessage?.message?.audioMessage ||
      msg.message?.viewOnceMessageV2?.message?.audioMessage ||
      msg.message?.viewOnceMessage?.message?.audioMessage ||
      msg.message?.audioMessage
    ) {
      message =
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
      message =
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
      message =
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
      message =
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
      content =
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
      message =
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
      message =
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
      message =
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
      message =
        msg.message?.viewOnceMessageV2?.message?.protocolMessage ||
        msg.message?.viewOnceMessage?.message?.protocolMessage ||
        msg.message?.protocolMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.protocolMessage != undefined ||
        msg.message.viewOnceMessage?.message?.protocolMessage != undefined

      messageType = 'protocolMessage'
    } else if (
      msg.message?.ephemeralMessage?.message?.liveLocationMessage ||
      msg.message?.viewOnceMessageV2?.message?.liveLocationMessage ||
      msg.message?.viewOnceMessage?.message?.liveLocationMessage ||
      msg.message?.liveLocationMessage
    ) {
      message =
        msg.message?.ephemeralMessage?.message?.liveLocationMessage ||
        msg.message?.viewOnceMessageV2?.message?.liveLocationMessage ||
        msg.message?.viewOnceMessage?.message?.liveLocationMessage ||
        msg.message?.liveLocationMessage

      viewOnce =
        msg.message.viewOnceMessageV2?.message?.liveLocationMessage != undefined ||
        msg.message.viewOnceMessage?.message?.liveLocationMessage != undefined

      messageType = 'liveLocationMessage'
    }

    return {
      message,
      messageType: messageType ?? null,
      content:
        content ??
        message?.caption ??
        message?.comment ??
        message?.name ??
        message?.text ??
        message?.description ??
        null,
      viewOnce,
    }
  }
}

export default new WhatsappStore()

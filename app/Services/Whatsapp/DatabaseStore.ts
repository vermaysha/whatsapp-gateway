/* eslint-disable eqeqeq */
import makeWASocket, {
  Chat,
  ConnectionState,
  Contact,
  downloadMediaMessage,
  jidNormalizedUser,
  proto,
} from '@adiwajshing/baileys'
import Device from 'App/Models/Device'
import Message, { MessageStatus, MessageType } from 'App/Models/Message'
import { writeFile } from 'fs/promises'
import { DateTime } from 'luxon'
import { Logger, LoggerOptions } from 'pino'
import Application from '@ioc:Adonis/Core/Application'
import Mime from 'mime'
import md5 from 'md5'
import { existsSync, mkdirSync } from 'fs'
import ChatModel from 'App/Models/Chat'
import ContactModel from 'App/Models/Contact'

class DatabaseStore {
  protected state: ConnectionState = { connection: 'close' }
  protected logger: Logger<LoggerOptions>

  /**
   * Bind database store
   *
   * @param sock BaileysEventEmmiter
   * @param device Device
   */
  public bind(
    sock: ReturnType<typeof makeWASocket>,
    logger: Logger<LoggerOptions>,
    device: Device
  ) {
    this.logger = logger
    sock.ev.on('connection.update', (update) => {
      Object.assign(this.state, update)
    })

    // Save new messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        try {
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
            const messageModel = await Message.create({
              keyId: msg.key.id,
              remoteJid: jidNormalizedUser(msg.key.remoteJid),
              fromMe: msg.key.fromMe ?? false,
              participant: msg.key.participant,
              pushName: msg.pushName,
              messageStatus: this.getMessageStatus(msg.status),
              messageType: messageType,
              content: content,
              mentionedJid: message?.contextInfo?.mentionedJid ?? [],
              viewOnce: message?.viewOnce ?? false,
              IsForwarded: message?.contextInfo?.isForwarded ?? false,
              deviceId: device.id,
              messageId: messageId ?? null,
              sendAt: DateTime.fromSeconds(msg.messageTimestamp),
            })

            if (msg && ['extendedTextMessage', 'conversation'].includes(messageType) === false) {
              const buffer = await downloadMediaMessage(
                msg,
                'buffer',
                {},
                {
                  logger: this.logger,
                  reuploadRequest: sock.updateMediaMessage,
                }
              )

              if (buffer) {
                const normalizeJid = jidNormalizedUser(msg.key.remoteJid)
                const ext = Mime.getExtension(message?.mimetype ?? '')
                const fileName = md5(msg.key.id)
                const mediaPath = Application.publicPath(`${normalizeJid}/${ext}`)
                if (!existsSync(mediaPath)) {
                  mkdirSync(mediaPath, {
                    recursive: true,
                  })
                }

                await messageModel.related('media').updateOrCreate(
                  {
                    messageId: messageModel.id,
                  },
                  {
                    fileLength: JSON.parse(message?.fileLength),
                    fileName: message?.fileName,
                    filePath: `${normalizeJid}/${ext}/${fileName}.${ext}`,
                    height: message?.height,
                    width: message?.width,
                    isAnimated: message?.isAnimated ?? false,
                    mimetype: message?.mimetype,
                    pageCount: message?.pageCount,
                    seconds: message?.seconds,
                  }
                )
                await writeFile(`${mediaPath}/${fileName}.${ext}`, buffer)
              }
            }
          }
        } catch (error) {
          logger.error(msg, error)
          console.error(error)
        }
      }
    })

    sock.ev.on('messages.update', async (messages) => {
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
          logger.error(msg, error)
          console.error(error)
        }
      }
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

    sock.ev.on('chats.upsert', this.chats)

    sock.ev.on('chats.update', this.chats)

    sock.ev.on('chats.delete', async (remoteJid) => {
      ;(await ChatModel.findBy('remote_jid', remoteJid))?.delete()
    })

    sock.ev.on('contacts.upsert', this.contacts)

    sock.ev.on('contacts.update', this.contacts)
  }

  protected async contacts(contacts: Partial<Contact>[]) {
    for (const contact of contacts) {
      if (!contact.id) {
        return
      }

      await ContactModel.updateOrCreate(
        {
          remoteJid: jidNormalizedUser(contact.id),
        },
        {
          remoteJid: jidNormalizedUser(contact.id),
          imgUrl: contact.imgUrl,
          name: contact.name,
          notify: contact.notify,
          status: contact.status,
          verifiedName: contact.verifiedName,
        }
      )
    }
  }

  protected async chats(chats: Partial<Chat>[]) {
    for (const chat of chats) {
      if (!chat.id) {
        return
      }

      await ChatModel.updateOrCreate(
        {
          remoteJid: chat.id,
        },
        {
          remoteJid: chat.id,
          archive: chat.archive,
          description: chat.description,
          displayName: chat.displayName,
          mute: chat.mute,
          name: chat.name,
          pin: chat.pin,
          readOnly: chat.readOnly ?? false,
          unreadCount: chat.unreadCount,
          unreadMentionCount: chat.unreadMentionCount,
          conversationAt: DateTime.fromSeconds(chat.conversationTimestamp),
        }
      )
    }
  }

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

export default new DatabaseStore()

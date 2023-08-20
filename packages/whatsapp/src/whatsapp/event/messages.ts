import type { WAMessageUpdate, WASocket } from '@whiskeysockets/baileys'
import { type Prisma, prisma } from 'database'
import {
  normalizeMessageContent,
  getContentType,
  isRealMessage,
  getKeyAuthor,
  jidNormalizedUser,
} from '@whiskeysockets/baileys'
import { extension } from 'mime-types'
import type {
  MessageReactionEventType,
  MessageUpsertEventType,
} from './messages.types'
import {
  convert2Buffer,
  convert2Timestamp,
  downloadMedia,
} from '../whatsapp.helper'
import { upsertContact } from './contacts'
import { logger } from '../whatsapp.logger'

/**
 * Upserts messages into the database based on the provided event.
 *
 * @param {MessageUpsertEventType} messages - The event containing the messages to upsert.
 * @param {WASocket} sock - The WebSocket connection.
 * @param {string} deviceId - The ID of the device.
 */
export async function messageUpsertEvent(
  messages: MessageUpsertEventType,
  sock: WASocket,
  deviceId: string,
) {
  if (!sock.user?.id) {
    return
  }

  for (const m of messages.messages) {
    const jid = jidNormalizedUser(getKeyAuthor(m.key, sock.user.id))

    if (jid === '' || !m.key.id) {
      continue
    }
    const isReal = isRealMessage(m, sock.user.id)

    if (!isReal) {
      continue
    }

    const msg = normalizeMessageContent(m.message)
    const type = getContentType(msg)

    if (!msg || !type) {
      continue
    }

    let title: string | undefined | null
    let text: string | undefined | null
    let media: string | undefined | null
    let mediaType: string | undefined | null
    let viewOnce = false

    switch (type) {
      case 'conversation':
        text = msg.conversation
        break

      case 'imageMessage':
        text = msg.imageMessage?.caption
        mediaType = msg.imageMessage?.mimetype ?? 'image/jpeg'
        media = await downloadMedia(m, sock, extension(mediaType) || 'jpg')
        viewOnce = msg.imageMessage?.viewOnce ?? false
        break

      case 'videoMessage':
        text = msg.videoMessage?.caption
        mediaType = msg.videoMessage?.mimetype ?? 'video/mp4'
        media = await downloadMedia(m, sock, extension(mediaType) || 'mp4')
        viewOnce = msg.videoMessage?.viewOnce ?? false
        break

      case 'extendedTextMessage':
        text = msg.extendedTextMessage?.text
        viewOnce = msg.extendedTextMessage?.viewOnce ?? false
        break

      case 'audioMessage':
        mediaType = msg.audioMessage?.mimetype ?? 'audio/mpeg'
        media = await downloadMedia(m, sock, extension(mediaType) || 'mp3')
        viewOnce = msg.audioMessage?.viewOnce ?? false
        break

      case 'stickerMessage':
        mediaType = msg.stickerMessage?.mimetype ?? 'image/gif'
        media = await downloadMedia(m, sock, extension(mediaType) || 'gif')
        break

      case 'documentMessage':
        text = msg.documentMessage?.caption
        title = msg.documentMessage?.title
        mediaType = msg.documentMessage?.mimetype ?? 'application/pdf'
        media = await downloadMedia(m, sock, extension(mediaType) || 'pdf')
        break
    }

    const messageContextInfo = {
      deviceListMetadataVersion:
        msg.messageContextInfo?.deviceListMetadataVersion,
      deviceListMetadata: {
        recipientKeyHash: convert2Buffer(
          msg.messageContextInfo?.deviceListMetadata?.recipientKeyHash,
        ),
        recipientKeyIndexes:
          msg.messageContextInfo?.deviceListMetadata?.recipientKeyIndexes ?? [],
        recipientTimestamp: convert2Timestamp(
          msg.messageContextInfo?.deviceListMetadata?.recipientTimestamp,
        ),
        senderKeyHash: convert2Buffer(
          msg.messageContextInfo?.deviceListMetadata?.senderKeyHash,
        ),
        senderKeyIndexes:
          msg.messageContextInfo?.deviceListMetadata?.senderKeyIndexes ?? [],
        senderTimestamp: convert2Timestamp(
          msg.messageContextInfo?.deviceListMetadata?.senderTimestamp,
        ),
      },
      messageSecret: convert2Buffer(msg.messageContextInfo?.messageSecret),
      paddingBytes: convert2Buffer(msg.messageContextInfo?.paddingBytes),
    }

    try {
      await upsertContact(
        {
          id: jid,
          notify: m.pushName ?? undefined,
          verifiedName: m.verifiedBizName ?? undefined,
        },
        sock,
        deviceId,
      )
      await prisma.message.create({
        data: {
          keyId: m.key.id,
          remoteJid: jid,
          contact: {
            connect: {
              jid,
            },
          },
          chat: {
            connectOrCreate: {
              where: {
                jid,
              },
              create: {
                jid,
                displayName: m.pushName ?? m.verifiedBizName,
                contact: {
                  connect: {
                    jid,
                  },
                },
                device: {
                  connect: {
                    id: deviceId,
                  },
                },
              },
            },
          },

          title,
          media,
          mediaType,
          text,
          type,
          viewOnce,
          broadcast: m.broadcast ?? false,
          stubType: m.messageStubType,
          status: m.status === undefined && type !== undefined ? 3 : m.status,
          revokeMessageTimestamp: convert2Timestamp(m.revokeMessageTimestamp),
          messageTimestamp: convert2Timestamp(m.messageTimestamp),
          messageContextInfo: messageContextInfo as Prisma.JsonObject,
        },
      })
    } catch (error: any) {
      logger.warn(
        {
          jid,
          trace: error?.stack,
        },
        `Failed to upsert message`,
      )
    }
    console.log('messageUpsertEvent', JSON.stringify({ m, msg, type }))
  }
}

/**
 * Updates the messages in the database based on the given message updates.
 *
 * @param {WAMessageUpdate[]} messages - An array of message updates.
 * @param {WASocket} sock - The WASocket object.
 */
export async function messageUpdateEvent(
  messages: WAMessageUpdate[],
  sock: WASocket,
) {
  for (const msg of messages) {
    if (!msg.key.remoteJid || !msg.key.id) {
      continue
    }

    const jid = jidNormalizedUser(getKeyAuthor(msg.key, sock.user?.id))
    const m = msg.update

    try {
      await prisma.message.update({
        where: {
          keyId_remoteJid: {
            keyId: msg.key.id,
            remoteJid: jid,
          },
        },
        data: {
          stubType: m.messageStubType,
          status: m.status,
          revokeMessageTimestamp: convert2Timestamp(m.revokeMessageTimestamp),
        },
      })

      if (m.status === 4) {
        await prisma.chat.update({
          where: {
            jid,
          },
          data: {
            unreadCount: {
              decrement: 1,
            },
          },
        })
      }
    } catch (error: any) {
      logger.warn(
        {
          jid,
          trace: error?.stack,
        },
        `Failed to update message`,
      )
    }
  }
}

/**
 * Processes the message reaction event by updating the reactions of the corresponding message in the database.
 *
 * @param {MessageReactionEventType[]} datas - An array of message reaction event data.
 * @return {Promise<void>} - A promise that resolves when the message reactions have been updated.
 */
export async function messageReactionEvent(
  datas: MessageReactionEventType[],
): Promise<void> {
  for (const data of datas) {
    if (!data.key.remoteJid) continue

    const jid = jidNormalizedUser(data.key.remoteJid)

    if (jid === '' || !data.key.id) {
      continue
    }

    try {
      await prisma.message.update({
        where: {
          keyId_remoteJid: {
            keyId: data.key.id,
            remoteJid: jid,
          },
        },
        data: {},
      })
    } catch (error: any) {
      logger.warn(
        {
          jid,
          trace: error?.stack,
        },
        `Failed to update reaction message`,
      )
    }
  }
}

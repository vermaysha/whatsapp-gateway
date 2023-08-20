import {
  jidNormalizedUser,
  type Chat,
  type WASocket,
} from '@whiskeysockets/baileys'
import { prisma } from 'database'
import { upsertContact } from './contacts'
import { convert2Timestamp } from '../whatsapp.helper'
import { logger } from '../whatsapp.logger'

/**
 * Processes a batch of chat events and updates the database accordingly.
 *
 * @param {Partial<Chat>[]} chats - An array of chat objects representing the chat events.
 * @param {WASocket} sock - The WebSocket connection object.
 * @param {string} deviceId - The ID of the device.
 * @return {Promise<void>} - A Promise that resolves when the database updates are complete.
 */
export async function chatEvent(
  chats: Partial<Chat>[],
  sock: WASocket,
  deviceId: string,
): Promise<void> {
  for (const chat of chats) {
    if (!chat.id) continue

    const jid = jidNormalizedUser(chat.id)

    await upsertContact(
      {
        id: jid,
        name: chat.displayName ?? undefined,
      },
      sock,
      deviceId,
    )
    try {
      await prisma.chat.upsert({
        where: {
          jid,
        },
        update: {
          jid,
          createdAt: convert2Timestamp(chat.createdAt),
          createdBy: chat.createdBy,
          description: chat.description,
          name: chat.name,
          displayName: chat.displayName,
          readOnly: chat.readOnly,
          shareOwnPn: chat.shareOwnPn,
          support: chat.support,
          suspended: chat.suspended,
          terminated: chat.terminated,
          unreadCount: {
            increment: chat.unreadCount ?? 0,
          },
          unreadMentionCount: {
            increment: chat.unreadMentionCount ?? 0,
          },
        },
        create: {
          jid,
          createdAt: convert2Timestamp(chat.createdAt),
          createdBy: chat.createdBy,
          description: chat.description,
          name: chat.name,
          displayName: chat.displayName,
          readOnly: chat.readOnly,
          shareOwnPn: chat.shareOwnPn,
          support: chat.support,
          suspended: chat.suspended,
          terminated: chat.terminated,
          unreadCount: chat.unreadCount,
          unreadMentionCount: chat.unreadMentionCount,
          device: {
            connect: {
              id: deviceId,
            },
          },
          contact: {
            connect: {
              jid,
            },
          },
        },
      })
    } catch (error: any) {
      logger.warn(
        {
          jid,
          trace: error?.stack,
        },
        `Failed to upsert chat`,
      )
    }
  }
}

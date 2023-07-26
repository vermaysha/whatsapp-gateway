import {
  jidNormalizedUser,
  type Chat,
  type WASocket,
} from '@whiskeysockets/baileys'
import { prisma } from 'database'
import { upsertContact } from './contacts'

/**
 * Processes a batch of chat events and updates the database accordingly.
 *
 * @param {Partial<Chat>[]} chats - An array of chat objects representing the chat events.
 * @param {WASocket} sock - The WebSocket connection object.
 * @return {Promise<void>} - A Promise that resolves when the database updates are complete.
 */
export async function chatEvent(
  chats: Partial<Chat>[],
  sock: WASocket,
): Promise<void> {
  for (const chat of chats) {
    if (!chat.id) continue

    const jid = jidNormalizedUser(chat.id)

    const data = {
      jid,
      pnJid: chat.pnJid,
      newJid: chat.newJid,
      oldJid: chat.oldJid,
      createdAt: chat.createdAt,
      createdBy: chat.createdBy,
      description: chat.description,
      name: chat.name,
      displayName: chat.displayName,
      pHash: chat.pHash,
      participant: chat.participant?.map((parti) => {
        return {
          jid: parti.userJid,
          rank: parti.rank,
        }
      }),
      readOnly: chat.readOnly,
      shareOwnPn: chat.shareOwnPn,
      support: chat.support,
      suspended: chat.suspended,
      terminated: chat.terminated,
      unreadCount: chat.unreadCount ?? 0,
      unreadMentionCount: chat.unreadMentionCount ?? 0,
    }

    await upsertContact(
      {
        id: jid,
        name: chat.displayName ?? undefined,
      },
      sock,
    )
    await prisma.chats.upsert({
      where: {
        jid,
      },
      update: data,
      create: {
        ...data,
        contact: {
          connect: {
            jid,
          },
        },
      },
    })
  }
}

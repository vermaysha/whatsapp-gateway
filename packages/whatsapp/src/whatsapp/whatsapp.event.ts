import {
  type Chat,
  type Contact,
  type WASocket,
  type proto,
} from '@whiskeysockets/baileys'
import { prisma } from 'database'
import { sendMessage } from '../worker/worker.helper'

async function logsToFile(title: string, data: any) {
  const json = JSON.stringify(data)
  const { writeFileSync } = await import('fs')
  writeFileSync('whatsapp.log', `${title}: ${json}\n`, {
    flag: 'a+',
  })
}

async function downloadMedia(
  message: proto.IWebMessageInfo,
  sock: WASocket,
  extension: string,
) {
  return new Promise<string>(async (resolve, reject) => {
    const { default: pino } = await import('pino')
    const { randomBytes } = await import('crypto')
    const { mkdirSync, createWriteStream } = await import('fs')
    const { downloadMediaMessage } = await import('@whiskeysockets/baileys')

    const buffer = await downloadMediaMessage(
      message,
      'buffer',
      {},
      {
        logger: pino({
          level: 'warn',
        }),
        reuploadRequest: sock.updateMediaMessage,
      },
    )

    const fixFileName = (file?: string) =>
      file?.replace(/\//g, '__')?.replace(/:/g, '-')

    const user = fixFileName(message.key.remoteJid!)

    const fileName = randomBytes(8).toString('hex')

    const fileDir = `./storages/${user}`
    mkdirSync(fileDir, { recursive: true })

    const filePath = `${fileDir}/${fileName}.${extension}`

    const writeStream = createWriteStream(filePath)
    writeStream.write(buffer)
    writeStream.end()

    writeStream.on('finish', () => {
      resolve(filePath)
    })

    writeStream.on('error', (err) => {
      reject(err.message)
    })
  })
}

async function contacts(contact: Contact, sock: WASocket) {
  const imgUrl = (await sock.profilePictureUrl(contact.id, 'image')) ?? null
  const data = {
    name: contact.name,
    jid: contact.id,
    notify: contact.notify,
    status: contact.status,
    verifiedName: contact.verifiedName,
    avatar: imgUrl,
  }
  await prisma.contacts.upsert({
    where: {
      jid: contact.id,
    },
    update: data,
    create: data,
  })
}

async function chatsCallback(chat: Chat) {
  const data = {
    jid: chat.id,
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

  return prisma.chats.upsert({
    where: {
      jid: chat.id,
    },
    update: data,
    create: {
      ...data,
      contact: {
        connectOrCreate: {
          create: {
            jid: chat.id,
          },
          where: {
            jid: chat.id,
          },
        },
      },
    },
  })
}

async function messagesCallback(
  message: proto.IWebMessageInfo,
  sock: WASocket,
) {
  const { extension } = await import('mime-types')
  if (
    message.key.remoteJid === 'status@broadcast' &&
    !(await sock.onWhatsApp(message.key.remoteJid))?.[0]?.exists
  ) {
    return
  }

  const m = message.message
  let type: string | undefined = Object.keys(m ?? {})?.[0] ?? undefined
  let title: string | undefined | null
  let text: string | undefined | null
  let media: string | undefined | null
  let mediaType: string | undefined | null

  if (type === '') {
    type = undefined
  }

  switch (type) {
    case 'conversation':
      text = m?.conversation
      break

    case 'imageMessage':
      text = m?.imageMessage?.caption
      mediaType = m?.imageMessage?.mimetype ?? 'image/jpeg'
      media = await downloadMedia(message, sock, extension(mediaType) || 'jpg')
      break

    case 'videoMessage':
      text = m?.videoMessage?.caption
      mediaType = m?.videoMessage?.mimetype ?? 'video/mp4'
      media = await downloadMedia(message, sock, extension(mediaType) || 'mp4')
      break

    case 'extendedTextMessage':
      text = m?.extendedTextMessage?.text
      break

    case 'audioMessage':
      mediaType = m?.audioMessage?.mimetype ?? 'audio/mpeg'
      media = await downloadMedia(message, sock, extension(mediaType) || 'mp3')
      break
  }

  if (message.key.id && message.key.remoteJid) {
    const data = {
      title,
      media,
      mediaType,
      text,
      type,
      fromMe: message.key.fromMe,
      stubType: message.messageStubType,
      mediaCiphertextSha256:
        message.mediaCiphertextSha256 &&
        Buffer.from(message.mediaCiphertextSha256),
      messageSecret:
        message.messageSecret && Buffer.from(message.messageSecret),
      status:
        message.status === undefined && type !== undefined ? 3 : message.status,
      reactions: message.reactions?.map((react) => {
        return {
          text: react.text,
          unread: react.unread,
          groupingKey: react.groupingKey,
          senderTimestampMs: react.senderTimestampMs,
        }
      }),
      revokeMessageTimestamp: message.revokeMessageTimestamp,
    }

    return prisma.messages.upsert({
      where: {
        keyId_remoteJid: {
          keyId: message.key.id,
          remoteJid: message.key.remoteJid,
        },
      },
      update: data,
      create: {
        ...data,
        keyId: message.key.id,
        remoteJid: message.key.remoteJid,
        contact: {
          connectOrCreate: {
            create: {
              jid: message.key.remoteJid,
              notify: message.pushName,
            },
            where: {
              jid: message.key.remoteJid,
            },
          },
        },
        chats: {
          connectOrCreate: {
            where: {
              jid: message.key.remoteJid,
            },
            create: {
              jid: message.key.remoteJid,
            },
          },
        },
      },
    })
  }
  return
}

export async function listenWhatsappEvent(sock: WASocket) {
  try {
    await prisma.$connect()
  } catch (error) {
    sendMessage({
      status: false,
      command: 'DB_CONNECTION_ERROR',
      data: error,
      message: 'Failed to connect to database',
    })
    console.error('Failed to connect to database', error)
    process.exit(1)
  }

  sock.ev.on('contacts.upsert', async (vals) => {
    logsToFile('contacts.upsert', vals)
    await Promise.all(vals.map((data) => contacts(data, sock)))
  })
  sock.ev.on('contacts.update', async (vals) => {
    logsToFile('contacts.update', vals)
    await Promise.all(
      vals.map((data) => data.id && contacts(data as Contact, sock)),
    )
  })

  sock.ev.on('chats.upsert', async (chats) => {
    logsToFile('chats.upsert', chats)
    await Promise.all(chats.map((chat) => chatsCallback(chat)))
  })
  sock.ev.on('chats.update', async (chats) => {
    logsToFile('chats.update', chats)
    await Promise.all(
      chats.map((chat) => {
        if (chat.id) {
          return chatsCallback(chat as Chat)
        }
      }),
    )
  })

  sock.ev.on('message-receipt.update', (data) =>
    logsToFile('message-receipt.update', data),
  )

  sock.ev.on('messages.delete', (data) => logsToFile('messages.delete', data))
  sock.ev.on('messages.upsert', async (messages) => {
    try {
      await Promise.all(
        messages.messages.map((message) => {
          return messagesCallback(message, sock)
        }),
      )
    } catch (e) {
      console.error(e)
    }
    logsToFile('messages.upsert', messages)
  })
  sock.ev.on('messages.update', async (messages) => {
    try {
      await Promise.all(
        messages.map((message) => {
          const data: proto.IWebMessageInfo = {
            ...message.update,
            key: message.key,
          }
          return messagesCallback(data, sock)
        }),
      )
    } catch (e) {
      console.error(e)
    }
    logsToFile('messages.update', messages)
  })
  sock.ev.on('messages.reaction', (data) =>
    logsToFile('messages.reaction', data),
  )
  sock.ev.on('messages.media-update', (data) =>
    logsToFile('messages.media-update', data),
  )
  sock.ev.on('messaging-history.set', (data) =>
    logsToFile('messaging-history.set', data),
  )

  sock.ev.on('call', (data) => logsToFile('call', data))

  sock.ev.on('group-participants.update', (data) =>
    logsToFile('group-participants.update', data),
  )

  sock.ev.on('presence.update', (data) => logsToFile('presence.update', data))

  sock.ev.on('blocklist.set', (data) => logsToFile('blocklist.set', data))
  sock.ev.on('blocklist.update', (data) => logsToFile('blocklist.update', data))

  sock.ev.on('groups.update', (data) => logsToFile('groups.update', data))
  sock.ev.on('groups.upsert', (data) => logsToFile('groups.upsert', data))

  sock.ev.on('labels.association', (data) =>
    logsToFile('labels.association', data),
  )
  sock.ev.on('labels.edit', (data) => logsToFile('labels.edit', data))
}

import { type WASocket } from '@whiskeysockets/baileys'
import {
  contactEvent,
  chatEvent,
  messageReactionEvent,
  messageUpdateEvent,
  messageUpsertEvent,
  callEvent,
  presenceEvent,
  groupEvent,
  groupParticipantEvent,
  blockListUpdateEvent,
  blocklistSetEvent,
  labelAssociationEvent,
  labelEvent,
} from './event'

export async function listenWhatsappEvent(sock: WASocket) {
  // Contact events
  sock.ev.on('contacts.upsert', (contacts) => contactEvent(contacts, sock))
  sock.ev.on('contacts.update', (contacts) => contactEvent(contacts, sock))

  sock.ev.on('chats.upsert', (args) => chatEvent(args, sock))
  sock.ev.on('chats.update', (args) => chatEvent(args, sock))

  // sock.ev.on('message-receipt.update', messageReceiptEvent)
  // sock.ev.on('messages.delete', messageDeleteEvent)
  sock.ev.on('messages.upsert', (args) => messageUpsertEvent(args, sock))
  sock.ev.on('messages.update', (args) => messageUpdateEvent(args, sock))
  sock.ev.on('messages.reaction', messageReactionEvent)
  // sock.ev.on('messages.media-update', messageMediaUpdate)
  // sock.ev.on('messaging-history.set', messageHistorySetEvent)

  // sock.ev.on('call', callEvent)
  // sock.ev.on('presence.update', presenceEvent)

  // sock.ev.on('groups.update', groupEvent)
  // sock.ev.on('groups.upsert', groupEvent)
  // sock.ev.on('group-participants.update', groupParticipantEvent)

  // sock.ev.on('blocklist.set', blocklistSetEvent)
  // sock.ev.on('blocklist.update', blockListUpdateEvent)

  // sock.ev.on('labels.association', labelAssociationEvent)
  // sock.ev.on('labels.edit', labelEvent)
}

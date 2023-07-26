import type { MessageUpsertType, proto } from '@whiskeysockets/baileys'

export type MessageUpsertEventType = {
  messages: proto.IWebMessageInfo[]
  type: MessageUpsertType
}

export type MessageReactionEventType = {
  key: proto.IMessageKey
  reaction: proto.IReaction
}

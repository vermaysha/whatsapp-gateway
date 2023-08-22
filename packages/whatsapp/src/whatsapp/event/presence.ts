import type { PresenceData } from '@whiskeysockets/baileys'

export function presenceEvent(data: {
  id: string
  presences: {
    [participant: string]: PresenceData
  }
}) {}

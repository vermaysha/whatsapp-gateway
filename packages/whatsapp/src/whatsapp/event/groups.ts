import type { GroupMetadata, ParticipantAction } from '@whiskeysockets/baileys'

export function groupEvent(data: Partial<GroupMetadata>[]) {
  console.log('groupEvent', JSON.stringify(data))
}

export function groupParticipantEvent(data: {
  id: string
  participants: string[]
  action: ParticipantAction
}) {
  console.log('groupParticipantEvent', JSON.stringify(data))
}

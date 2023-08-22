import type { GroupMetadata, ParticipantAction } from '@whiskeysockets/baileys'

export function groupEvent(data: Partial<GroupMetadata>[]) {
  //
}

export function groupParticipantEvent(data: {
  id: string
  participants: string[]
  action: ParticipantAction
}) {
  //
}

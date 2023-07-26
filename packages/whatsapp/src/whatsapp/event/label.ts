import type { Label } from '@whiskeysockets/baileys/lib/Types/Label'
import type { LabelAssociation } from '@whiskeysockets/baileys/lib/Types/LabelAssociation'

export function labelAssociationEvent(data: {
  association: LabelAssociation
  type: 'add' | 'remove'
}) {
  console.log('labelAssociationEvent', data)
}

export function labelEvent(data: Label) {
  console.log('labelEvent', data)
}

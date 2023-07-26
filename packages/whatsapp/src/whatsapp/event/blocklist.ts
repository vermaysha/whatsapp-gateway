export function blocklistSetEvent(data: { blocklist: string[] }) {
  console.log('blocklistSetEvent', data)
}

export function blockListUpdateEvent(data: {
  blocklist: string[]
  type: 'add' | 'remove'
}) {
  console.log('blockListUpdateEvent', data)
}

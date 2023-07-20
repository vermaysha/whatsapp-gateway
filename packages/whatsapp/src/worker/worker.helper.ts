import type { OutputMessage } from './worker.interface'

export function sendMessage(data: OutputMessage) {
  return process.send?.(data)
}

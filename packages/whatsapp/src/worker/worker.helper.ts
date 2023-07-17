import process from 'process'
import { OutputMessage } from './worker.interface'

export function sendMessage(data: OutputMessage) {
  return process.send?.(data)
}

import { sendMessage } from '../worker.helper'

export function getUptime() {
  const data = process.uptime()
  sendMessage({
    command: 'GET_UPTIME',
    status: true,
    data,
  })
}

import { sendMessage } from '../worker.helper'

export function getMemUsage() {
  const data = process.memoryUsage.rss()
  sendMessage({
    command: 'GET_MEMORY_USAGE',
    status: true,
    data,
  })
}

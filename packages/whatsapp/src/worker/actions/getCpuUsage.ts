import { sendMessage } from '../worker.helper'

export function getCpuUsage() {
  const data = process.cpuUsage()
  sendMessage({
    command: 'GET_CPU_USAGE',
    status: true,
    data,
  })
}

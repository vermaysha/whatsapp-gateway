import type { Whatapp } from '../../whatsapp'
import { sendMessage } from '../worker.helper'

export async function stop(whatsapp?: Whatapp) {
  await whatsapp?.stop()
  sendMessage({
    command: 'STOP_SERVICE',
    status: true,
    message: 'Service Stopped',
  })
  process.exit(1)
}

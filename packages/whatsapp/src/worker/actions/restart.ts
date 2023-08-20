import type { Whatapp } from '../../whatsapp'
import { sendMessage } from '../worker.helper'

export async function restart(
  params: { deviceId: string },
  whatsapp?: Whatapp,
) {
  await whatsapp?.restart()
  sendMessage({
    command: 'RESTART_SERVICE',
    status: true,
    message: 'Service Restarted',
    data: params,
  })
}

import type { Whatapp } from '../../whatsapp'
import { sendMessage } from '../worker.helper'

export async function restart(
  params: { deviceId: string },
  whatsapp?: Whatapp,
) {
  whatsapp?.restart(params.deviceId)
  sendMessage({
    command: 'RESTART_SERVICE',
    status: true,
    message: 'Service Restarted',
    data: params,
  })
}

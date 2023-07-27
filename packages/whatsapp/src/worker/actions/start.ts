import type { Whatapp } from '../../whatsapp'
import { sendMessage } from '../worker.helper'

/**
 * Starts the WhatsApp service with the specified device ID.
 *
 * @param {Object} params - The parameters for starting the service.
 * @param {string} params.deviceId - The ID of the device.
 * @return {Promise<Whatapp>} A promise that resolves to the WhatsApp instance.
 */
export async function start(params: { deviceId: string }): Promise<Whatapp> {
  const whatsapp = (await import('../../whatsapp/whatsapp')).default
  whatsapp?.start(params.deviceId)
  sendMessage({
    command: 'START_SERVICE',
    status: true,
    message: 'Service Started',
    data: params,
  })

  return whatsapp
}

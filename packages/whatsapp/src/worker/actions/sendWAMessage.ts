import { AnyMessageContent } from '@whiskeysockets/baileys'
import type { Whatapp } from '../../whatsapp'
import { sendMessage } from '../worker.helper'

export async function sendWAMessage(params: any, whatsapp?: Whatapp) {
  const id = params.id
  const result = await whatsapp?.socket?.onWhatsApp(id)

  if (!result?.[0].exists) {
    return sendMessage({
      command: 'SEND_MESSAGE',
      status: true,
      message: "ID does'nt registered in Whatsapp",
      data: params,
    })
  }

  const jid = result[0].jid

  const content: AnyMessageContent = params.content
  try {
    await whatsapp?.socket?.sendMessage(jid, content)
    sendMessage({
      command: 'SEND_MESSAGE',
      status: false,
      message: 'Message sent',
      data: params,
    })
  } catch (error) {
    sendMessage({
      command: 'SEND_MESSAGE',
      status: false,
      message: (error as Error).message,
      data: params,
    })
  }
}

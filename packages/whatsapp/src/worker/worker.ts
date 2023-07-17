import process from 'process'
import type { InputMessage } from './worker.interface'
import { sendMessage } from './worker.helper'
import type { AnyMessageContent } from '@whiskeysockets/baileys'
import type { Whatapp } from '../whatsapp'

let whatsapp: Whatapp | null = null

process.on('message', async (message: InputMessage) => {
  const { command, params } = message
  switch (command) {
    case 'START_SERVICE':
      whatsapp = (await import('../whatsapp/whatsapp')).default
      whatsapp?.start(params.deviceId)
      sendMessage({
        command: 'START_SERVICE',
        status: true,
        message: 'Service Started',
        data: params,
      })
      break

    case 'STOP_SERVICE':
      whatsapp?.stop()
      sendMessage({
        command: 'STOP_SERVICE',
        status: true,
        message: 'Service Stopped',
      })
      process.exit(1)

    case 'RESTART_SERVICE':
      whatsapp?.restart(params.deviceId)
      sendMessage({
        command: 'RESTART_SERVICE',
        status: true,
        message: 'Service Restarted',
        data: params,
      })
      break

    case 'GET_CPU_USAGE':
      sendMessage({
        command: 'GET_CPU_USAGE',
        status: true,
        data: process.cpuUsage(),
      })
      break

    case 'GET_MEMORY_USAGE':
      sendMessage({
        command: 'GET_MEMORY_USAGE',
        status: true,
        data: process.memoryUsage(),
      })
      break

    case 'SEND_MESSAGE':
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
      break
  }
})

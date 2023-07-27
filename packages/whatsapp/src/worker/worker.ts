import process from 'process'
import type { InputMessage } from './worker.interface'
import type { Whatapp } from '../whatsapp'
import * as actions from './actions'

let whatsapp: Whatapp | undefined

process.on('message', async (message: InputMessage) => {
  const { command, params } = message

  switch (command) {
    case 'START_SERVICE':
      whatsapp = await actions.start(params)
      break

    case 'STOP_SERVICE':
      await actions.stop(whatsapp)
      break

    case 'RESTART_SERVICE':
      await actions.restart(params, whatsapp)
      break

    case 'GET_CPU_USAGE':
      actions.getCpuUsage()
      break

    case 'GET_MEMORY_USAGE':
      actions.getMemUsage()
      break

    case 'SEND_MESSAGE':
      await actions.sendWAMessage(params, whatsapp)
      break
  }
})

process.on('beforeExit', async () => {
  await whatsapp?.stop()
})

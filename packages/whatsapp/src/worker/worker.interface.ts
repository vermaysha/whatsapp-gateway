export type InputCommand =
  | 'START_SERVICE'
  | 'STOP_SERVICE'
  | 'RESTART_SERVICE'
  | 'GET_CPU_USAGE'
  | 'GET_MEMORY_USAGE'
  | 'SEND_MESSAGE'

export type OutputCommand =
  | 'QR_RECEIVED'
  | 'CONNECTION_UPDATE'
  | 'MESSAGE_RECEIVED'

export interface InputMessage {
  command: InputCommand
  params: any
}

export interface OutputMessage {
  command: InputCommand | OutputCommand
  status: boolean
  message?: string | null
  data?: any
}

export type InputCommand =
  | 'START_SERVICE'
  | 'STOP_SERVICE'
  | 'RESTART_SERVICE'
  | 'GET_CPU_USAGE'
  | 'GET_MEMORY_USAGE'
  | 'SEND_MESSAGE'
  | 'GET_UPTIME'

export type OutputCommand =
  | 'QR_RECEIVED'
  | 'CONNECTION_UPDATE'
  | 'MESSAGE_RECEIVED'
  | 'DB_CONNECTION_ERROR'
  | 'STOPPED'
  | 'DEVICE_NOT_FOUND'
  | 'DEVICE_ALREADY_STARTED'

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

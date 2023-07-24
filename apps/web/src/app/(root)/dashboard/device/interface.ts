import { IPagination } from "../../interface"

export interface IDevice {
  id: "64b5fa6f3ae3db3b7eacbc1a"
  name: "Default"
  contactId: null
  qr: null
  status: "close"
  startedAt: "2023-07-20T05:07:53.105Z"
  stoppedAt: null
  updated_at: "2023-07-20T05:30:23.522Z"
}

export interface IDevices {
  data: IDevice[]
  pagination: IPagination
}

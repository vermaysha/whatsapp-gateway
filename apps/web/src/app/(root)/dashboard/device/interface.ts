import { IPagination } from "../../interface"

export interface IDevice {
  id: string
  name: string
  contactId: string | null
  qr: string | null
  status: string
  startedAt: string | null
  stoppedAt: string | null
  updated_at: string | null
  owner: {
    id: string
    jid: string
    name: string
    notify: string
    status: string
    verifiedName: string
    avatar: string
    updatedAt: string
  }
}

export interface IDevices {
  data: IDevice[]
  pagination: IPagination
}

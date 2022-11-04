import { Request, Response } from 'express'
import Whatsapp from '../libraries/Whatsapp'
import QRCode from 'qrcode'

class QrCodeController {
  public async scan(_req: Request, res: Response) {
    const qrCode = Whatsapp.getQrCode()
    res.render('qrcode', {
      qrCode: qrCode == undefined ? null : await QRCode.toDataURL(qrCode),
      status: Whatsapp.getStatus(),
    })
  }
}

export default new QrCodeController()

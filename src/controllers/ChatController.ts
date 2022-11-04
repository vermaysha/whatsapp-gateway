import { Request, Response } from 'express'
import Whatsapp from '../libraries/Whatsapp'

class ChatController {
  public async send(req: Request, res: Response) {
    const number = req.body.number || req.params.number || req.query.number
    const msg = req.body.message || req.params.message || req.query.message
    const sock = Whatsapp.get()

    if (sock == null || sock == undefined) {
      return res.status(400).json({
        error: 'Whatsapp Client is not connected or not available',
      })
    }

    if (number == undefined || number == null) {
      return res.status(422).json({
        error: 'Params number cannot be null',
      })
    }

    if (msg == undefined || msg == null) {
      return res.status(422).json({
        error: 'Params message cannot be null',
      })
    }

    const [result] = await sock.onWhatsApp(number)

    if (!result.exists) {
      return res.status(422).json({
        error: 'Phone number is invalid',
      })
    }

    const jid = result.jid

    try {
      await sock.sendMessage(jid, {
        text: msg,
      })

      return res.status(200).json({
        message: 'Message has been sent',
      })
    } catch (error) {
      return res.status(400).json({
        error,
      })
    }
  }
}

export default new ChatController()

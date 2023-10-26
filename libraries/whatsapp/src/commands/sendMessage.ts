import { type Whatapp } from "../whatsapp";
import { type Logger } from 'pino'

interface ISendMessage {
  to: string
  message: string
}

export default (wa: Whatapp, logger: Logger) => {
  return {
    name: 'SEND_MESSAGE',
    async handler(data: ISendMessage) {
      try {
        if (!wa.socket) {
          process.send?.({
            command: 'SEND_MESSAGE',
            status: false,
            data: 'Failed to send message, WhatsApp is not running',
          })
          return;
        }

        const socket = wa.socket;

        await socket.waitForSocketOpen();
        const [result] = await socket.onWhatsApp(data.to)

        if (!result?.exists) {
          process.send?.({
            command: 'SEND_MESSAGE',
            status: false,
            data: 'Failed to send message, phone number not registered on WhatsApp',
          })
          return
        }
        console.log(result, data);

        const msg = await socket.sendMessage(result.jid, {
          text: data.message,
        })
        console.log(msg)
        process.send?.({
          command: 'SEND_MESSAGE',
          status: true,
          data: 'Message sent successfully',
        })
      } catch (error) {
        console.error(error)
      }
      return
    }
  }
}

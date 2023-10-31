import { type Whatapp } from "../whatsapp";
import { type Logger } from 'pino'

interface ISendMessage {
  to: string
  data: any
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
        await socket.sendPresenceUpdate('available');
        await socket.sendPresenceUpdate('composing');

        await socket.sendMessage(result.jid, data.data)

        await socket.sendPresenceUpdate('available');
        process.send?.({
          command: 'SEND_MESSAGE',
          status: true,
          data: 'Message sent successfully',
        })
      } catch (err) {
        const error = err as any;
        process.send?.({
          command: 'SEND_MESSAGE',
          status: false,
          data: error.message ?? error ?? 'Failed to send message',
        })
      }
      return
    }
  }
}

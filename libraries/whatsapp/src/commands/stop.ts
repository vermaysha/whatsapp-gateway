import { type Whatapp } from "../whatsapp";
import { type Logger } from 'pino'

export default (wa: Whatapp, _logger: Logger) => {
  return {
    name: 'STOP',
    async handler(_data: any) {
      wa.stop();
    }
  }
}

import { type Whatapp } from "../whatsapp";
import { type Logger } from 'pino'

export default (wa: Whatapp, _logger: Logger) => {
  return {
    name: 'START',
    async handler(_data: any) {
      wa.start();
    }
  }
}

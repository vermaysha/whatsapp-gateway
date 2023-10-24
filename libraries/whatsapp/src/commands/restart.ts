import { type Whatapp } from "../whatsapp";
import { type Logger } from 'pino'

export default (wa: Whatapp, _logger: Logger) => {
  return {
    name: 'RESTART',
    async handler(_data: any) {
      wa.stop().then(() => {
        wa.start();
      });
    }
  }
}

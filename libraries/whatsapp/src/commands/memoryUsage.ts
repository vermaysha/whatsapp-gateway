import { type Whatapp } from "../whatsapp";
import { type Logger } from 'pino'

export default (wa: Whatapp, _logger: Logger) => {
  return {
    name: 'MEMORY_USAGE',
    async handler(_data: any) {
      const rss = process.memoryUsage.rss();

      process.send?.({
        command: 'MEMORY_USAGE',
        status: true,
        data: rss,
      })
    }
  }
}

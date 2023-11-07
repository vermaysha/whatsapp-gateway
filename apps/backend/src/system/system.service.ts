import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { check, DiskUsage } from 'diskusage';
import { totalmem, freemem } from 'os';
import { memoryUsage } from 'process';

@Injectable()
export class SystemService {
  constructor(private readonly whatsapp: WhatsappService) {}

  /**
   * Calculates the disk usage of the system.
   *
   * @return {Promise<DiskUsage>} The total disk usage in bytes.
   */
  async diskUsage(): Promise<DiskUsage> {
    return check('/');
  }

  /**
   * Retrieves the memory usage of the application and server.
   *
   * @returns {object} The memory usage information.
   *  - `process`: The memory usage of the application process.
   *  - `server`: The memory usage of the server.
   *  - `other`: The memory usage of other resources.
   *  - `total`: The total memory available.
   */
  async memoryUsage() {
    const processUsage = (
      await this.whatsapp.sendCommand<number>('MEMORY_USAGE')
    ).data;
    const serverUsage = memoryUsage.rss();
    const total = totalmem();
    const other = freemem() - serverUsage - serverUsage;

    return {
      process: processUsage,
      server: serverUsage,
      other: other,
      total: total,
    };
  }
}

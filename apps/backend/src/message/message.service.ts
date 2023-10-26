import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';
@Injectable()
export class MessageService {
  constructor(private readonly whatsapp: WhatsappService) {}

  /**
   * Sends a text message to a specified recipient.
   *
   * @param {string} to - The recipient of the message.
   * @param {string} message - The message to be sent.
   * @return {Promise<any>} A promise that resolves with the response from sending the message.
   */
  async sendTextMessage(to: string, message: string) {
    try {
      // Limit the message to 4096 characters
      message = message.substring(0, 4096 - 1);
      const res = await this.whatsapp.sendCommand('SEND_MESSAGE', {
        to,
        message,
      });

      return res;
    } catch (error) {
      throw new Error(error.message ?? error ?? 'Failed to send message');
    }
  }
}

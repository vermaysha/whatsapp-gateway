import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ISendMediaMessage, ISendTextMessage } from './message.dto';
import { HttpService } from '@nestjs/axios';
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { resolve as pathResolve } from 'path';

@Injectable()
export class MessageService {
  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly http: HttpService,
  ) {}

  /**
   * Sends a text message.
   *
   * @param {ISendTextMessage} to - The recipient of the message.
   * @return {Promise<any>} - A promise that resolves to the response of the send command.
   */
  async sendTextMessage({ to, message }: ISendTextMessage): Promise<any> {
    try {
      // Limit the message to 4096 characters
      message = message.substring(0, 4096 - 1);
      const res = await this.whatsapp.sendCommand('SEND_MESSAGE', {
        to,
        data: {
          text: message,
        },
      });

      return res;
    } catch (error) {
      throw new Error(error.message ?? error ?? 'Failed to send message');
    }
  }

  /**
   * Sends a media message.
   *
   * @param {ISendMediaMessage} sendMediaMessage - Object containing the parameters for the media message.
   * @param {string} sendMediaMessage.to - The recipient of the media message.
   * @param {string} sendMediaMessage.mediaUrl - The URL of the media file to be sent.
   * @param {string} sendMediaMessage.message - The message to be sent along with the media file.
   * @param {string} sendMediaMessage.fileName - The name of the media file.
   * @param {string} sendMediaMessage.mediaType - The type of media (audio, image, video, document).
   * @return {Promise<any>} Resolves with the response data if the message is sent successfully.
   * @throws {Error} Throws an error if the message fails to send.
   */
  async sendMediaMessage({
    to,
    mediaUrl,
    message,
    fileName,
    mediaType,
  }: ISendMediaMessage): Promise<any> {
    const res = await this.detectMimeTypes(mediaUrl);
    const mimeTypes = res.mimeTypes ?? null;
    if (!mediaType || mediaType == 'auto') {
      mediaType = res.type as any;
    }

    let data: any = {};
    const mediaPath = new URL(mediaUrl);

    if (mediaType == 'audio') {
      data = {
        audio: {
          url: mediaPath,
          mimetype: mimeTypes,
        },
      };
    } else if (mediaType == 'image') {
      data = {
        image: {
          url: mediaPath,
          mimetype: mimeTypes,
        },
        caption: message,
      };
    } else if (mediaType == 'video') {
      data = {
        video: {
          url: mediaPath,
          mimetype: mimeTypes,
        },
        caption: message,
      };
    } else {
      data = {
        document: {
          url: mediaPath,
          mimetype: mimeTypes,
        },
        caption: message,
        mimetype: mimeTypes,
        fileName,
      };
    }

    try {
      // Limit the message to 4096 characters
      message = message.substring(0, 4096 - 1);
      const res = await this.whatsapp.sendCommand('SEND_MESSAGE', {
        to,
        data,
      });

      if (res.status) {
        return res.data;
      }
      throw new Error(res.data);
    } catch (error) {
      rmSync(mediaPath);
      throw new Error(error.message ?? error ?? 'Failed to send message');
    }
  }

  /**
   * Detects the MIME type of a given URL.
   *
   * @param {string} url - The URL to detect the MIME type for.
   * @return {Promise<{ type: string, mimeTypes: string }>} - The detected MIME type and its corresponding type.
   */
  async detectMimeTypes(
    url: string,
  ): Promise<{ type: string; mimeTypes: string }> {
    const header = (await this.http.axiosRef.head(url)).headers;
    const fileType =
      header?.['Content-Type']?.toString() ||
      header?.['content-type']?.toString();

    const imageMimeType = ['image/gif', 'image/jpeg', 'image/png'];
    const videoMimeType = [
      'video/mpeg',
      'video/mp4',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/x-msvideo',
      'video/x-flv',
      'video/webm',
    ];
    const audioMimeType = [
      'audio/mpeg',
      'audio/x-ms-wma',
      'audio/vnd.rn-realaudio',
      'audio/x-wav',
    ];

    if (!fileType) {
      return {
        type: 'document',
        mimeTypes: fileType,
      };
    } else if (imageMimeType.includes(fileType)) {
      return {
        type: 'image',
        mimeTypes: fileType,
      };
    } else if (videoMimeType.includes(fileType)) {
      return {
        type: 'video',
        mimeTypes: fileType,
      };
    } else if (audioMimeType.includes(fileType)) {
      return {
        type: 'audio',
        mimeTypes: fileType,
      };
    }

    return {
      type: 'document',
      mimeTypes: fileType,
    };
  }

  /**
   * Downloads media from the provided URL.
   *
   * @param {string} url - The URL of the media to download.
   * @return {Promise<string>} The file path of the downloaded media.
   */
  async downloadMedia(url: string): Promise<string> {
    try {
      const response = await this.http.axiosRef.get(url, {
        responseType: 'arraybuffer', // Menetapkan responseType ke 'arraybuffer'
      });

      if (response.status === 200) {
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const folderPath = pathResolve(process.cwd(), 'public', 'media');
        if (!existsSync(folderPath)) {
          mkdirSync(folderPath, { recursive: true });
        }
        const filePath = pathResolve(folderPath, fileName);
        const buffer = Buffer.from(response.data);
        writeFileSync(filePath, buffer);
        return filePath;
      }
      throw new Error(`Gagal mengunduh file. Kode status: ${response.status}`);
    } catch (error) {
      throw error;
    }
  }
}

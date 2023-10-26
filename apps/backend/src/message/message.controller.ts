import { Controller, HttpException, Res } from '@nestjs/common';
import { TypedRoute, TypedBody } from '@nestia/core';
import { MessageService } from './message.service';
import type { Response } from 'express';
import { ISendTextMessage } from './message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly message: MessageService) {}

  @TypedRoute.Post('/sendTextMessage')
  /**
   * Send a text message.
   *
   * @param {Response} res - The response object.
   * @param {ISendTextMessage} body - The body of the message.
   * @return {Promise<void>} - A promise that resolves to void.
   */
  async sendTextMessage(
    @Res() res: Response,
    @TypedBody() body: ISendTextMessage,
  ) {
    try {
      const result = await this.message.sendTextMessage(body.to, body.message);

      return res.send(result.message);
    } catch (error) {
      throw new HttpException(
        error.message ?? error ?? 'Failed to send message',
        500,
      );
    }
  }
}

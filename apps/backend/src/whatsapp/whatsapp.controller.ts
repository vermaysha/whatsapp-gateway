import { HttpException, Controller, Res } from '@nestjs/common';
import { TypedRoute } from '@nestia/core';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private whatsapp: WhatsappService) {}

  @TypedRoute.Get('/')
  async index(@Res() res: Response) {
    const { workerStartedAt, connectedAt, workerState, connectionState } =
      this.whatsapp;

    return res.send({
      connectionState,
      connectedAt,
      workerState,
      workerStartedAt,
    });
  }

  @TypedRoute.Get('/start')
  /**
   * Starts the asynchronous operation.
   *
   * @return {Promise<{ status: boolean }>} A promise that resolves with an object containing the status.
   * @throws {HttpException} If an error occurs during the operation.
   */
  async start() {
    try {
      await this.whatsapp.start();

      return {
        status: true,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error?.message ?? 'Failed to start connection',
        },
        500,
      );
    }
  }

  @TypedRoute.Get('/stop')
  /**
   * Stops the execution of the function.
   *
   * @return {Promise<{ status: boolean }>} An object indicating the status of the function execution.
   * @throws {HttpException} If there was an error stopping the connection.
   */
  async stop() {
    try {
      await this.whatsapp.stop();

      return {
        status: true,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error?.message ?? 'Failed to stop connection',
        },
        500,
      );
    }
  }

  @TypedRoute.Get('restart')
  /**
   * Restarts the function by stopping and then starting it.
   *
   * @throws {HttpException} If there is an error during restart, a 500 HTTP exception is thrown with a message.
   */
  async restart() {
    try {
      await this.stop();
      await this.start();
    } catch (error) {
      throw new HttpException(
        {
          message: error?.message ?? 'Failed to restart connection',
        },
        500,
      );
    }
  }

  @TypedRoute.Get('connect')
  /**
   * Asynchronously connects to the worker.
   *
   * @return {Promise<{ status: boolean }>} An object with the status of the connection.
   * @throws {HttpException} If failed to connect to the worker.
   */
  async connect() {
    try {
      await this.whatsapp.connect();

      return {
        status: true,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error?.message ?? 'Failed to connect to the worker',
        },
        500,
      );
    }
  }

  @TypedRoute.Get('disconnect')
  /**
   * Disconnects from the worker.
   *
   * @return {Promise<{ status: boolean }>} The status of the disconnection.
   * @throws {HttpException} If there was an error disconnecting from the worker.
   */
  async disconnect() {
    try {
      await this.whatsapp.disconnect();

      return {
        status: true,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error?.message ?? 'Failed to disconnect from the worker',
        },
        500,
      );
    }
  }

  @TypedRoute.Get('reconnect')
  /**
   * Reconnects to the worker.
   *
   * @return {Promise<void>} A promise that resolves when the reconnection is successful.
   * @throws {HttpException} If there is an error during reconnection.
   */
  async reconnect() {
    try {
      await this.disconnect();
      await this.connect();
    } catch (error) {
      throw new HttpException(
        {
          message: error?.message ?? 'Failed to reconnect to the worker',
        },
        500,
      );
    }
  }
}

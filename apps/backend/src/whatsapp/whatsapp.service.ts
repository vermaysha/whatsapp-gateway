import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { fork, type ChildProcess } from 'child_process';
import { resolve as pathResolve } from 'path';

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
  private _worker: ChildProcess | null = null;
  private workerPath: string;
  private logger = new Logger(WhatsappService.name);
  private _connectionState: 'open' | 'connecting' | 'close' = 'close';

  /**
   * Constructor for the class.
   *
   */
  constructor() {
    const home = pathResolve(process.cwd(), '..', '..');
    this.workerPath = pathResolve(home, 'libraries/whatsapp/dist/main.js');
  }

  /**
   * Executes the necessary cleanup tasks when the module is destroyed.
   *
   * No parameters are required.
   *
   * Does not return any value.
   */
  onModuleDestroy() {
    try {
      this.stop().then(() => {
        this.disconnect();
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Called when the module is initialized.
   *
   * @return {Promise<void>} Returns a promise that resolves when the function finishes executing.
   */
  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  /**
   * Sends a command to the worker and returns a promise that resolves with the response.
   *
   * @param {string} command - The command to be sent to the worker.
   * @param {any} data - Optional data to be sent along with the command.
   * @return {Promise<any>} A promise that resolves with the response from the worker.
   */
  async sendCommand(command: string, data: any = null) {
    return new Promise<any>((resolve, reject) => {
      if (!this._worker || this._worker.killed) {
        resolve(null);
        return;
      }

      const res = this._worker.send({
        command,
        data,
      });

      if (res) {
        const callback = (response: any) => {
          if (response.command === command) {
            this._worker?.removeListener('message', callback);
            resolve(response.data);
          }
        };

        this._worker.on('message', callback);

        setTimeout(() => {
          resolve(true);
        }, 10_000);

        return;
      }

      resolve(null);
    });
  }

  /**
   * Starts the function asynchronously.
   *
   * @return {Promise<void>} A Promise that resolves once the function has started.
   */
  async start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this._worker || this._worker.killed) {
        reject('Worker is not running');
        return;
      }

      const res = this._worker?.send({
        command: 'START',
      });

      if (res) {
        const callback = (response: any) => {
          if (
            !(
              response.command === 'CONNECTION_UPDATED' &&
              response.data.status !== 'close'
            )
          ) {
            return;
          }
          this._worker?.removeListener('message', callback);
          resolve();
          return;
        };

        this._worker.on('message', callback);
        setTimeout(() => {
          this._worker?.removeListener('message', callback);
          reject('Failed to start worker, timeout');
        }, 10_000);
        return;
      }

      reject('Failed to start worker');
    });
  }

  /**
   * Stops the execution of the function and returns a promise that resolves when the function is stopped or rejects with an error message.
   *
   * @return {Promise<void>} A promise that resolves when the function is stopped or rejects with an error message.
   */
  async stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this._worker || this._worker.killed) {
        reject('Worker is not running');
        return;
      }

      const res = this._worker?.send({
        command: 'STOP',
      });

      if (res) {
        const callback = (response: any) => {
          if (
            !(
              response.command === 'CONNECTION_UPDATED' &&
              response.data.status == 'close'
            )
          ) {
            return;
          }
          this._worker?.removeListener('message', callback);
          resolve();
          return;
        };

        this._worker.on('message', callback);
        setTimeout(() => {
          this._worker?.removeListener('message', callback);
          reject('Failed to stop whatsapp server, timeout');
        }, 10_000);
        return;
      }

      reject('Failed to stop to whatsapp server');
    });
  }

  async restart() {
    try {
      await this.start();
      await this.stop();
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  /**
   * Connects to the worker process.
   *
   * @return {Promise<boolean>} Returns a promise that resolves to true if the connection is successful, or false if there is already an existing connection.
   */
  async connect(): Promise<boolean> {
    if (this._worker) {
      return false;
    }

    this._worker = fork(this.workerPath, {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    });

    this._worker?.unref();
    this._worker.stdout?.on('data', (res) => {
      console.log(res.toString());
    });

    this._worker.stderr?.on('data', (res) => {
      console.log(res.toString());
    });

    return true;
  }

  /**
   * Disconnects the worker process.
   *
   * @return {Promise<boolean>} A promise that resolves to true if the worker was successfully disconnected, or rejects with an error message if there was an issue disconnecting the worker.
   */
  async disconnect(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this._worker || this._worker?.killed) {
        reject('Worker is not running');
        return;
      }

      const res = this._worker.kill('SIGTERM');
      if (res) {
        const callback = () => {
          this._worker?.stdin?.removeAllListeners();
          this._worker?.stdout?.removeAllListeners();
          this._worker?.stderr?.removeAllListeners();
          this._worker?.removeAllListeners();
          this._worker = null;
          resolve(true);
        };
        this._worker.once('exit', callback);
        setTimeout(() => {
          reject('Failed to kill worker, timeout');
        }, 10_000);
        return;
      }

      reject('Failed to kill worker');
    });
  }

  /**
   * Reconnects to the worker process.
   *
   * @return {Promise<boolean>} A promise that resolves to true if the reconnection is successful, otherwise false.
   */
  async reconnect(): Promise<boolean> {
    try {
      await this.disconnect();
      await this.connect();
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  /**
   * Returns the worker.
   *
   * @return {ChildProcess | null} the worker
   */
  get worker(): ChildProcess | null {
    return this._worker;
  }

  /**
   * Retrieves the current connection state.
   *
   * @return {"open" | "connecting" | "close"} The current connection state.
   */
  get connectionState(): 'open' | 'connecting' | 'close' {
    return this._connectionState ?? 'close';
  }

  /**
   * Retrieves the current worker state.
   *
   * @return {"connected" | "disconnected"} The current worker state.
   */
  get workerState(): 'connected' | 'disconnected' {
    if (!this._worker) {
      return 'disconnected';
    }
    return this._worker?.connected ? 'connected' : 'disconnected';
  }
}

import { Injectable, Logger } from '@nestjs/common'
import { fork, type ChildProcess } from 'child_process'
import { LogsService } from '../logs/logs.service'
import { InputCommand, OutputCommand, OutputMessage } from 'whatsapp'
import { EventsGateway } from '../events/events.gateway'

interface IMemoryUsage {
  rss: number
  heapTotal: number
  heapUsed: number
  external: number
  arrayBuffers: number
}

export type WhatsappWorker = {
  process: ChildProcess
  meta: {
    status: string | null
    qr: string | null
  }
}

@Injectable()
export class WhatsappsService {
  constructor(
    private logsService: LogsService,
    private eventsGateway: EventsGateway,
  ) {}

  private workers = new Map<string, WhatsappWorker>()

  /**
   * Starts the device with the specified deviceId for the given userId.
   *
   * @param {string} deviceId - The ID of the device to start.
   * @param {string} userId - The ID of the user associated with the device.
   * @return {boolean} Returns true if the device was successfully started, false otherwise.
   */
  public start(deviceId: string, userId: string): boolean {
    if (this.get(deviceId)) {
      return false
    }

    const child = fork('../../packages/whatsapp/dist/bin.js', [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    })

    child.send({
      command: 'START_SERVICE',
      params: { deviceId },
    })

    child.stdout?.on('data', (data) => {
      try {
        const dataJson = JSON.parse(data.toString())
        const meta = Object.keys(dataJson)
          .filter(
            (key) =>
              ![
                'level',
                'name',
                'hostname',
                'pid',
                'time',
                'trace',
                'msg',
              ].includes(key),
          )
          .reduce((acc: any, key) => {
            acc[key] = dataJson[key]
            return acc
          }, {})

        this.logsService.create({
          device: {
            connect: {
              id: deviceId,
            },
          },
          level: dataJson.level,
          name: dataJson.name,
          hostname: dataJson.hostname,
          msg: dataJson.msg,
          pid: dataJson.pid,
          time: dataJson.time ? new Date(dataJson.time) : new Date(),
          trace: dataJson.trace,
          meta,
        })
      } catch (error) {
        Logger.warn(error.message, 'WhatsappsService', data.toString())
      }
    })

    child.stderr?.on('data', (data) => {
      Logger.warn(data.toString(), 'WhatsappsService')
    })

    child.on('message', (message) => {
      const data = message as OutputMessage
      const meta = this.workers.get(deviceId)?.meta
      if (data.command === 'CONNECTION_UPDATE' && meta) {
        meta.status = data.data
        this.eventsGateway.emit('CONNECTION_UPDATE', userId, {
          deviceId,
          data: data.data,
        })
      }

      if (data.command === 'QR_RECEIVED' && meta) {
        meta.qr = data.data
        this.eventsGateway.emit('QR_RECEIVED', userId, {
          deviceId,
          data: data.data,
        })
      }

      if (data.command === 'STOPPED') {
        child.kill()
        this.workers.delete(deviceId)
      }
      if (data.command === 'DB_CONNECTION_ERROR') {
        child.kill()
        this.workers.delete(deviceId)

        Logger.error('Database connection error', 'WhatsappsService')
      }
    })

    this.workers.set(deviceId, {
      process: child,
      meta: {
        status: null,
        qr: null,
      },
    })

    return true
  }

  /**
   * Retrieves a worker by its ID.
   *
   * @param {string} id - The ID of the worker to retrieve.
   * @return {WhatsappWorker | undefined} The worker object associated with the given ID.
   */
  public get(id: string): WhatsappWorker | undefined {
    return this.workers.get(id)
  }

  /**
   * Retrieves the status of an item with the given ID.
   *
   * @param {string} id - The ID of the item to retrieve the status for.
   * @return {string} The status of the item. Returns 'close' if the item or its metadata is not found.
   */
  public getStatus(id: string): string {
    const child = this.get(id)?.meta

    return child?.status ?? 'close'
  }

  /**
   * Retrieves the QR code for the specified ID.
   *
   * @param {string} id - The ID of the item to retrieve the QR code for.
   * @returns {string | null} The QR code corresponding to the specified ID, or null if it doesn't exist.
   */
  public getQr(id: string): string | null {
    const child = this.get(id)?.meta

    return child?.qr ?? null
  }

  /**
   * Stops a child process with the given ID.
   *
   * @param {string} id - The ID of the child process to stop.
   * @return {boolean} Returns true if the child process was successfully stopped, false otherwise.
   */
  async stop(id: string): Promise<boolean> {
    const child = this.get(id)

    if (child) {
      await this.sendCommand(id, 'STOP_SERVICE')
    }

    return this.workers.delete(id)
  }

  /**
   * Retrieves the memory usage for a given id.
   *
   * @param {string} id - The id of the object to retrieve memory usage for.
   * @return {Promise<IMemoryUsage>} A promise that resolves to the memory usage information.
   */
  memoryUsage(id: string): Promise<IMemoryUsage> {
    return this.sendCommand(id, 'GET_MEMORY_USAGE')
  }

  /**
   * Sends a command to the specified worker identified by the given ID and waits for the response.
   *
   * @param {string} id - The ID of the worker to send the command to.
   * @param {InputCommand | OutputCommand} command - The command to send.
   * @return {Promise<any>} A promise that resolves with the response data when the worker responds with the specified command, or rejects with an error if the worker is not found or not running.
   */
  async sendCommand(
    id: string,
    command: InputCommand | OutputCommand,
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const child = this.workers.get(id)

      if (!child) {
        return reject(new Error('Whatsapp service not found or not running'))
      }

      function handleResponse(response: OutputMessage) {
        if (response.command === command) {
          child?.process.removeListener('message', handleResponse)
          resolve(response.data)
        }
      }

      child.process.on('message', handleResponse)

      child.process.send({
        command,
        params: { deviceId: id },
      })
    })
  }
}

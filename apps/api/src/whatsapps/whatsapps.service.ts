import { Injectable, Logger } from '@nestjs/common'
import { fork, type ChildProcess } from 'child_process'
import { DevicesService } from 'src/devices/devices.service'
import { LogsService } from 'src/logs/logs.service'
import { InputCommand, OutputCommand, OutputMessage } from 'whatsapp'

interface IMemoryUsage {
  rss: number
  heapTotal: number
  heapUsed: number
  external: number
  arrayBuffers: number
}

@Injectable()
export class WhatsappsService {
  constructor(private logsService: LogsService) {}

  private workers = new Map<string, ChildProcess>()

  /**
   * Starts the specified process with the given ID.
   *
   * @param {string} id - The ID of the process.
   * @return {boolean} This function does not return anything.
   */
  public start(id: string): boolean {
    if (this.get(id)) {
      return false
    }

    const child = fork('../../packages/whatsapp/dist/bin.js', [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    })

    child.send({
      command: 'START_SERVICE',
      params: { deviceId: id },
    })

    child.stdout?.on('data', (data) => {
      try {
        const dataJson = JSON.parse(data.toString())
        const meta = Object.keys(dataJson)
          .filter(
            (key) =>
              ![
                'level',
                'class',
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
              id,
            },
          },
          level: dataJson.level,
          class: dataJson.class,
          hostname: dataJson.hostname,
          msg: dataJson.msg,
          pid: dataJson.pid,
          time: dataJson.time,
          trace: dataJson.trace,
          meta,
        })
      } catch (error) {
        Logger.warn(error.message)
      }
    })

    child.stderr?.on('data', (data) => {
      console.log(data.toString())
    })

    this.workers.set(id, child)

    return true
  }

  /**
   * Retrieves a worker by its ID.
   *
   * @param {string} id - The ID of the worker to retrieve.
   * @return {ChildProcess | undefined} The worker object associated with the given ID.
   */
  public get(id: string): ChildProcess | undefined {
    return this.workers.get(id)
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
          child?.removeListener('message', handleResponse)
          resolve(response.data)
        }
      }

      child.on('message', handleResponse)

      child.send({
        command,
        params: { deviceId: id },
      })
    })
  }
}

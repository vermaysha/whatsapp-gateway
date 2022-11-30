import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    if (this.app.environment === 'web') {
      await import('../start/events')
      await import('../start/socket')
    }

    const { default: Device } = await import('App/Models/Device')
    const { DateTime } = await import('luxon')

    const devices = await Device.query().whereNotIn('status', [
      'LOGGED_OUT',
      'DISCONNECTED',
      'CLOSE',
    ])

    for (const device of devices) {
      device.status = 'CLOSE'
      device.disconnectedAt = DateTime.now()
      device.qr = null
      await device.save()
    }
  }

  public async shutdown() {
    // App shutdown
  }
}

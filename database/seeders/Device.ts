import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Device from 'App/Models/Device'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    const user = await User.findOrFail(1)
    const device = new Device()
    device.name = 'Default Device'
    device.description = 'Default Device'

    device.related('user').associate(user)
  }
}

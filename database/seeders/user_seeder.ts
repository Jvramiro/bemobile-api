import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      fullName: 'Admin',
      email: 'admin@bemobile.com',
      password: await hash.make('admin123'),
      role: 'admin',
    })
  }
}
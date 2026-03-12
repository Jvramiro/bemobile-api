import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gateways'

  async up() {
    const db = this.db
    await db.schema.createTable('gateways', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('priority').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
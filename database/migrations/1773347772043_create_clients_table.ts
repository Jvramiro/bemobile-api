import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    const db = this.db
    await db.schema.createTable('clients', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
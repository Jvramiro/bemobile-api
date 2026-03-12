import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    const db = this.db
    await db.schema.createTable('products', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('amount').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
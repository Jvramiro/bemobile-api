import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    const db = this.db
    await db.schema.createTable('transactions', (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().references('id').inTable('clients')
      table.integer('gateway_id').unsigned().references('id').inTable('gateways')
      table.string('external_id').nullable()
      table.string('status').notNullable()
      table.integer('amount').notNullable()
      table.string('card_last_numbers', 4).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
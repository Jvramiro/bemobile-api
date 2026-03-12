import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_products'

  async up() {
    const db = this.db
    await db.schema.createTable('transaction_products', (table) => {
      table.increments('id')
      table.integer('transaction_id').unsigned().references('id').inTable('transactions')
      table.integer('product_id').unsigned().references('id').inTable('products')
      table.integer('quantity').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
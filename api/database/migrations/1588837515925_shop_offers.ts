import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ShopOffers extends BaseSchema {
  protected tableName = 'shop_offers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('category_id')
      table.string('name', 255)
      table.text('description')
      table.string('image')
      table.integer('price')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('device_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('devices')
        .onDelete('CASCADE')

      table.string('remote_jid').nullable()
      table.string('img_url').nullable()
      table.string('name').nullable()
      table.string('notify').nullable()
      table.string('status').nullable()
      table.string('verified_name').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

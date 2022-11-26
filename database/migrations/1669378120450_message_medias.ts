import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'message_medias'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('message_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE')
      table
        .integer('device_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('devices')
        .onDelete('CASCADE')

      table.string('file_name').nullable()
      table.string('file_path').nullable()
      table.integer('page_count').nullable()
      table.string('mimetype').nullable()
      table.bigInteger('file_length').unsigned().nullable()
      table.bigInteger('height').unsigned().nullable()
      table.bigInteger('width').unsigned().nullable()
      table.bigInteger('seconds').unsigned().nullable()
      table.boolean('is_animated').defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

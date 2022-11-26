import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

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
      table
        .integer('message_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE')
      table.string('key_id').notNullable().unique()
      table.string('remote_jid').notNullable()
      table.boolean('from_me').defaultTo(false)
      table.string('participant').nullable()
      table.string('push_name').nullable()
      table.text('content').nullable()
      table.string('thumbnail').nullable()
      table.json('mentioned_jid').nullable()
      table.string('message_status').notNullable()
      table.string('message_type').notNullable()
      table.boolean('view_once').defaultTo(false)
      table.boolean('is_forwarded').defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('send_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

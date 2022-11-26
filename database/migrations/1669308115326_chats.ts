import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'chats'

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
      table.string('remote_jid').notNullable()
      table.boolean('archive').defaultTo(false)
      table.string('photo_profile').nullable()
      table.string('description').nullable()
      table.string('display_name').nullable()
      table.string('name').nullable()
      table.bigint('mute').nullable()
      table.bigint('pin').nullable()
      table.boolean('read_only').defaultTo(false)
      table.bigint('unread_count').nullable()
      table.bigint('unread_mention_count').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('conversation_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

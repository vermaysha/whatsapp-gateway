import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'groups'

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
      table.string('subject').notNullable()
      table.boolean('announce').nullable()
      table.bigint('creation').nullable()
      table.text('desc').nullable()
      table.string('desc_id').nullable()
      table.string('desc_owner').nullable()
      table.bigint('ephemeral_duration').nullable()
      table.string('owner').nullable()
      table.boolean('restrict').nullable()
      table.bigint('size').nullable()
      table.string('subject_owner').nullable()
      table.bigint('subject_time').nullable()
      table.string('photo_profile').nullable()

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

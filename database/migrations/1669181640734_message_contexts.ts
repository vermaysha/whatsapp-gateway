import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'message_contexts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('message_id')
        .unsigned()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE')

      table.jsonb('action_link').nullable()
      table.binary('conversion_data').nullable()
      table.bigint('conversion_delay_seconds').unsigned().nullable()
      table.string('conversion_source').nullable()
      table.jsonb('disappearing_mode').nullable()
      table.string('entry_point_conversion_app').nullable()
      table.bigint('entry_point_conversion_delay_seconds').unsigned().nullable()
      table.string('entry_point_conversion_source').nullable()
      table.jsonb('ephemeral_setting_timestamp').nullable()
      table.binary('ephemeral_shared_secret').nullable()
      table.bigint('expiration').unsigned().nullable()
      table.jsonb('external_ad_reply').nullable()
      table.decimal('forwarding_score').nullable()
      table.string('group_subject').nullable()
      table.boolean('is_forwarded').nullable()
      table.jsonb('mentioned_jid').nullable()
      table.string('parent_group_jid').nullable()
      table.jsonb('placeholder_key').nullable()
      table.string('remote_jid').nullable()
      table.string('stanza_id').nullable()

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

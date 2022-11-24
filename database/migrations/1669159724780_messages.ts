import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key_remote_jid').notNullable()
      table.boolean('key_from_me').notNullable()
      table.string('key_id').notNullable()
      table.string('key_participant').nullable()
      table.string('agent_id').nullable()
      table.bigint('biz_privacy_status').unsigned().nullable()
      table.boolean('broadcast').nullable()
      table.boolean('clear_media').nullable()
      table.bigint('duration').unsigned().nullable()
      table.bigint('ephemeral_duration').unsigned().nullable()
      table.boolean('ephemeral_off_to_on').nullable()
      table.boolean('ephemeral_out_of_sync').nullable()
      table.jsonb('ephemeral_start_timestamp').unsigned().nullable()
      table.jsonb('final_live_location').nullable()
      table.binary('futureproof_data').nullable()
      table.boolean('ignore').nullable()
      table.jsonb('keep_in_chat').nullable()
      table.jsonb('labels').nullable()
      table.binary('media_ciphertext_sha256').nullable()
      table.jsonb('media_data').nullable()
      table.jsonb('message_c2s_timestamp').nullable()
      table.binary('message_secret').nullable()
      table.jsonb('message_stub_parameters').nullable()
      table.integer('message_stub_type').nullable()
      table.jsonb('message_timestamp').nullable()
      table.boolean('multicast').nullable()
      table.string('original_self_author_user_jid_string').nullable()
      table.string('participant').nullable()
      table.jsonb('photo_change').nullable()
      table.jsonb('poll_additional_metadata').nullable()
      table.jsonb('poll_updates').nullable()
      table.string('push_name').nullable()
      table.jsonb('quoted_sticker_data').nullable()
      table.jsonb('reactions').nullable()
      table.jsonb('revoke_message_timestamp').nullable()
      table.boolean('starred').nullable()
      table.integer('status').nullable()
      table.boolean('status_already_viewed').nullable()
      table.boolean('url_number').nullable()
      table.boolean('url_text').nullable()
      table.jsonb('user_receipt').nullable()
      table.string('verified_biz_name').nullable()

      table.integer('device_id').unsigned().references('id').inTable('devices').onDelete('CASCADE')
      table
        .integer('message_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE')

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

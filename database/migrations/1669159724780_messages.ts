import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('remote_jid')
      table.boolean('from_me')
      table.string('key_id')
      table.bigInteger('message_timestamp').unsigned()
      table.string('push_name')
      table.integer('status').unsigned()
      table.string('type').nullable()

      // messageContextInfo
      table.string('sender_key_hash')
      table.integer('sender_timestamp').unsigned()
      table.string('recipient_key_hash')
      table.integer('recipient_timestamp').unsigned()
      table.integer('device_list_metadata_version').unsigned()
      table.string('message_secret').nullable()

      // message
      table.string('message_type') // audioMessage, documentMessage, imageMessage, locationMessage, contactMessage, pollCreationMessage, pollUpdateMessage, conversationMessage, videoMessage, stickerMessage, extendedTextMessage, protocolMessage
      table.boolean('view_once_message').defaultTo(false)

      table.string('url').nullable()
      table.string('mimetype').nullable()
      table.string('title').nullable()
      table.string('file_sha256').nullable()
      table.integer('file_length').unsigned().nullable()
      table.integer('page_count').unsigned().nullable()
      table.string('media_key').nullable()
      table.string('file_name').nullable()
      table.string('file_enc_sha256').nullable()
      table.string('direct_path').nullable()
      table.bigInteger('media_key_timestamp').unsigned().nullable()

      table.integer('height').unsigned().nullable()
      table.integer('width').unsigned().nullable()
      table.string('jpeg_thumbnail').nullable()

      table.integer('seconds').unsigned().nullable()
      table.boolean('ptt').nullable()
      table.string('waveform').nullable()

      table.decimal('degrees_latitude', 8, 6).nullable()
      table.decimal('degrees_longitude', 9, 6).nullable()

      table.string('display_name').nullable()
      table.text('vcard').nullable()

      table.string('poll_name').nullable()
      table.jsonb('poll_options').nullable()
      table.integer('selectable_options_count').unsigned().nullable()

      table.string('poll_remote_jid').nullable()
      table.boolean('poll_from_me').nullable()
      table.string('poll_id').nullable()
      table.string('poll_enc_payload').nullable()
      table.string('poll_enc_iv').nullable()
      table.bigInteger('senderTimestampMs').unsigned().nullable()

      table.text('text').nullable()

      table.boolean('gif_playback').nullable()
      table.string('gif_attribution').nullable()

      table.boolean('is_animated').nullable()
      table.string('scans_sidecar').nullable()
      table.jsonb('scan_lengths').nullable()
      table.string('mid_quality_file_sha256').nullable()

      table.string('preview_type').nullable()

      table.string('footer_text').nullable()
      table.jsonb('buttons').nullable()
      table.string('header_type').nullable()

      table.integer('device_id').unsigned().references('id').inTable('devices').onDelete('CASCADE')
      table
        .integer('message_id')
        .unsigned()
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

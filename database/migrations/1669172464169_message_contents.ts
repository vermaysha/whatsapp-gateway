import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'message_contents'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('message_id')
        .unsigned()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE')

      table.string('message_type')

      table.string('caption').nullable()
      table.boolean('contact_vcard').nullable()
      table.string('direct_path').nullable()
      table.binary('file_enc_sha256').nullable()
      table.jsonb('file_length').nullable()
      table.string('file_name').nullable()
      table.binary('file_sha256').nullable()
      table.binary('jpeg_thumbnail').nullable()
      table.binary('media_key').nullable()
      table.jsonb('media_key_timestamp').nullable()
      table.string('mimetype').nullable()
      table.bigint('page_count').unsigned().nullable()
      table.string('thumbnail_direct_path').nullable()
      table.binary('thumbnail_enc_sha256').nullable()
      table.bigint('thumbnail_height').unsigned().nullable()
      table.binary('thumbnail_sha256').nullable()
      table.bigint('thumbnail_width').unsigned().nullable()
      table.string('title').nullable()
      table.string('url').nullable()

      table.boolean('ptt').nullable()
      table.bigint('seconds').unsigned().nullable()
      table.binary('streaming_sidecar').nullable()
      table.binary('waveform').nullable()

      table.bigint('experiment_group_id').unsigned().nullable()
      table.bigint('first_scan_length').unsigned().nullable()
      table.binary('first_scan_sidecar').nullable()
      table.bigint('height').unsigned().nullable()
      table.binary('mid_quality_file_enc_sha256').nullable()
      table.binary('mid_quality_file_sha256').nullable()
      table.jsonb('scan_lengths').nullable()
      table.binary('scans_sidecar').nullable()
      table.string('static_url').nullable()
      table.boolean('view_once').nullable()
      table.bigint('width').unsigned().nullable()

      table.bigint('accuracy_in_meters').unsigned().nullable()
      table.string('address').nullable()
      table.string('comment').nullable()
      table.string('degrees_clockwise_from_magnetic_north').nullable()
      table.decimal('degrees_latitude', 8, 6).nullable()
      table.decimal('degrees_longitude', 9, 6).nullable()
      table.boolean('is_live').nullable()
      table.string('name').nullable()
      table.bigint('speed_in_mps').unsigned().nullable()

      table.text('conversation').nullable()

      table.string('gif_attribution').nullable()
      table.boolean('gif_playback').nullable()

      table.bigint('first_frame_length').unsigned().nullable()
      table.binary('first_frame_sidecar').nullable()
      table.boolean('is_animated').nullable()
      table.binary('png_thumbnail').nullable()

      table.bigint('background_argb').unsigned().nullable()
      table.string('canonical_url').nullable()
      table.text('description').nullable()
      table.boolean('do_not_play_inline').nullable()
      table.string('font').nullable()
      table.string('invite_link_group_type').nullable().unsigned()
      table.string('invite_link_group_type_v2').nullable()
      table.string('invite_link_parent_group_subject_v2').nullable()
      table.string('matched_text').nullable()
      table.string('preview_type').nullable()
      table.string('text').nullable()
      table.bigint('text_argb').unsigned().nullable()

      table.string('type').nullable().unsigned()

      table.string('group_jid').nullable()
      table.string('group_name').nullable()
      table.bigint('group_type').unsigned().nullable()
      table.string('invite_code').nullable()
      table.jsonb('invite_expiration').nullable()

      table.bigint('sequence_number').unsigned().nullable()
      table.bigint('time_offset').unsigned().nullable()

      table.jsonb('sender_timestamp_ms').nullable()
      table.string('reaction_remote_jid').nullable()
      table.string('reactionid').nullable()
      table.boolean('reaction_from_me').nullable()
      table.string('reaction_participant').nullable()
      table.string('grouping_key').nullable()

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

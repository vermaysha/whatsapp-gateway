export interface ISendTextMessage {
  /**
   * The phone number of the recipient.
   */
  to: string;

  /**
   * The message to be sent.
   */
  message: string;
}

export interface ISendMediaMessage extends ISendTextMessage {
  /**
   * The media to be sent.
   */
  mediaUrl: string;

  /**
   * The media type.
   *
   * @default 'auto' auto detect mime-types and set to document for fallback
   */
  mediaType?: 'audio' | 'image' | 'video' | 'document' | 'auto';

  /**
   * The name of the file
   * only for document type
   */
  fileName?: string;
}

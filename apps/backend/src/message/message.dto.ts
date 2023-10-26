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

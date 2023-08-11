export class IContactsList {
  /**
   * The page number to retrieve.
   *
   * @type int
   * @minimum 1
   * @default 1
   */
  page?: number | null

  /**
   * The number of messages per page.
   *
   * @type int
   * @minimum 1
   * @default 1
   */
  perPage?: number | null
}

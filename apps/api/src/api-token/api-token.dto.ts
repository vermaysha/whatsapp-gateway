export class PaginationDTO {
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

export class ListDTO extends PaginationDTO {
  /**
   * The search query keyword.
   */
  search?: string | null

  /**
   * The sort order.
   *
   * @default desc
   */
  order?: 'asc' | 'desc'

  /**
   * The field to sort by.
   *
   * @default createdAt
   */
  orderBy?: 'createdAt' | 'updatedAt' | 'name'
}

export class ApiTokenCreateDto {
  /**
   * The name of the API token.
   */
  name: string

  /**
   * The description of the API token.
   */
  description?: string | null

  /**
   * The expiration date of the API token.
   *
   * @format date-time
   */
  expiredAt?: string | null
}

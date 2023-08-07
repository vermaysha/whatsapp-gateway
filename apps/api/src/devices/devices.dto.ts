export class DeviceListDTO {
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
  orderBy?: 'createdAt' | 'updatedAt' | 'name' | 'startedAt' | 'stoppedAt'
}

export class DeviceSummaryDTO {
  /**
   * The search query keyword.
   */
  search?: string | null
}

export class UpdateDto {
  name: string
}

export class CreateDto {
  name: string
}

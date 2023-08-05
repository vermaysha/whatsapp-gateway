export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export type PaginateOptions = {
  page?: number | null
  perPage?: number | null
}

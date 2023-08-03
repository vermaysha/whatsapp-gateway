export class ApiTokenListDto {
  page?: number | null

  perPage?: number | null
}

export class ApiTokenCreateDto {
  name: string

  description?: string | null

  expiredAt?: Date | null
}

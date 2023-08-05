import { PaginateOptions, PaginatedResult } from './pagination.interface'

/**
 * Retrieves paginated data from a model.
 *
 * @param {any} model - The model to retrieve data from.
 * @param {any} args - Optional arguments for filtering the data.
 * @param {PaginateOptions} options - Optional pagination options.
 * @returns {Promise<PaginatedResult<K>>} A promise that resolves to a paginated result.
 */
export async function paginate<K>(
  model: any,
  args: any = { where: undefined },
  options?: PaginateOptions,
): Promise<PaginatedResult<K>> {
  const page = options?.page ?? 1
  const perPage = options?.perPage ?? 10

  const skip = page > 0 ? perPage * (page - 1) : 0
  const [total, data] = await Promise.all([
    model.count({ where: args.where ?? undefined }),
    model.findMany({
      ...args,
      take: perPage,
      skip,
    }),
  ])
  const lastPage = Math.ceil(total / perPage)

  return {
    data,
    pagination: {
      total,
      lastPage,
      currentPage: page,
      perPage,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  }
}

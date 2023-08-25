import { PaginateOptions, PaginatedResult } from './pagination.interface'

/**
 * Exclude specified fields from a given model object.
 *
 * @param {Model} model - The model object from which to exclude fields.
 * @param {Field[]} fields - An array of fields to exclude from the model object.
 * @return {Omit<Model, Field>} - A new model object with the specified fields excluded.
 */
export function exclude<Model, Field extends keyof Model>(
  model: Model,
  fields: Field[],
): Omit<Model, Field> {
  const data = Object.fromEntries(
    Object.entries(model as any).filter(
      ([field]) => !fields.includes(field as any),
    ),
  )

  return data as unknown as Omit<Model, Field>
}

/**
 * Retrieves paginated data from a model.
 *
 * @param {any} model - The model to retrieve data from.
 * @param {any} args - Optional arguments for filtering the data.
 * @param {PaginateOptions} options - Optional pagination options.
 */
export async function paginate<Args, Model, Field extends keyof Model>(
  model: any,
  args: Args,
  options?: PaginateOptions,
  excluded?: string[],
) {
  const page = options?.page ?? 1
  const perPage = options?.perPage ?? 10

  const skip = page > 0 ? perPage * (page - 1) : 0
  const [total, data] = await Promise.all([
    model.count({ where: (args as any).where ?? undefined }),
    model.findMany({
      ...args,
      take: perPage,
      skip,
    }),
  ])
  const lastPage = Math.ceil(total / perPage)

  return {
    data: excluded ? data.map((item: any) => exclude(item, excluded)) : data,
    pagination: {
      total,
      lastPage,
      currentPage: page,
      perPage,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  } as PaginatedResult<Omit<Model, Field>>
}

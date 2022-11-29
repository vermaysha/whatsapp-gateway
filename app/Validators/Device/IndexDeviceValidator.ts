import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../Reporters/MyReporter'

export default class IndexValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    page: schema.number.optional([rules.unsigned()]),
    perPage: schema.number.optional([rules.unsigned()]),
    orderBy: schema.enum.optional([
      'id',
      'name',
      'connected_at',
      'created_at',
      'updated_at',
    ] as const),
    direction: schema.enum.optional(['desc', 'asc'] as const),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'page.number': 'Page number only accepts number',
    'page.unsigned': 'Page number only accepts positive numbers',
    'perPage.number': 'Page number only accepts number',
    'perPage.unsigned': 'Per page only accepts positive numbers',
    'orderBy.enum': 'Order by only accepts id, name, connected_at, created_at and updated_at',
    'direction.enum': 'Direction only accepts desc and asc',
  }

  public reporter = MyReporter
}

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
    deviceId: schema.number([rules.unsigned()]),
    remoteJid: schema.string.nullableAndOptional(),
    page: schema.number.optional([rules.unsigned()]),
    perPage: schema.number.optional([rules.unsigned()]),
    orderBy: schema.enum.optional(['id', 'send_at', 'created_at', 'updated_at'] as const),
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
    'deviceId.required': 'Device ID is required',
    'deviceId.number': 'Device ID only accepts number',
    'deviceId.unsigned': 'Device ID only accepts positive numbers',
    'page.number': 'Page number only accepts number',
    'page.unsigned': 'Page number only accepts positive numbers',
    'perPage.number': 'Page number only accepts number',
    'perPage.unsigned': 'Per page only accepts positive numbers',
    'orderBy.enum': 'Order by only accepts id, suject, size, created_at and updated_at',
    'direction.enum': 'Direction only accepts desc and asc',
  }

  public reporter = MyReporter
}

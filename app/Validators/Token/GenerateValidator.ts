import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from '../Reporters/MyReporter'

export default class GenerateValidator {
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
    name: schema.string([
      rules.alphaNum({
        allow: ['space', 'dash', 'underscore'],
      }),
      rules.maxLength(50),
    ]),
    description: schema.string.optional([rules.maxLength(250)]),
    expiresAt: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
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
    'name.required': 'Device name is required',
    'name.alphaNum':
      'Device name may only contain alphanumeric characters, spaces, underscores, and dashes',
    'name.maxLength': 'The maximum length of a device name is 50 characters',
    'description.maxLength': 'The maximum length of a device description is 200 characters',
  }

  /**
   * Custom Error Reporter
   */
  public reporter = MyReporter
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'
import GenerateValidator from 'App/Validators/Token/GenerateValidator'
import IndexValidator from 'App/Validators/Token/IndexValidator'

export default class TokensController {
  /**
   * Get all API Tokens
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async index({ request, response, auth }: HttpContextContract) {
    const { page, perPage, orderBy, direction } = await request.validate(IndexValidator)

    const tokens = await Token.query()
      .select(['id', 'name', 'type', 'description', 'expires_at', 'created_at'])
      .where('user_id', auth.use('jwt').user?.id!)
      .where('type', 'api')
      .orderBy(orderBy ?? 'id', direction)
      .paginate(page ?? 1, perPage ?? 10)

    return response.ok(tokens)
  }

  /**
   * Generate new API Token
   *
   * @param param0 HttpContextContract
   * @returns Promise<void>
   */
  public async generate({ request, response, auth }: HttpContextContract) {
    const { name, description, expiresAt } = await request.validate(GenerateValidator)

    const token = await auth.use('api').generate(auth.use('jwt').user!, {
      name: name,
      description: description,
      expiresIn: expiresAt?.toSeconds() ?? undefined,
    })

    return response.ok({
      message: 'TOKEN_GENERATED',
      data: token,
    })
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './auth.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Authenticates the user based on the provided token in the request header.
   *
   * @param {ExecutionContext} context - The execution context object.
   * @return {Promise<boolean>} Returns `true` if the user is authenticated, otherwise throws an `UnauthorizedException`.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const mustAuthenticated = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!mustAuthenticated) {
      return true
    }

    const request = context.switchToHttp().getRequest() as FastifyRequest

    if (!request.session.get('user')) {
      throw new UnauthorizedException('User must be logged in')
    }

    return true
  }
}

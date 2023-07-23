import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './auth.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

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
    const token = this.extractTokenFromCookie(request)
    if (!token) {
      throw new UnauthorizedException('Token not found')
    }
    try {
      const payload = await this.jwtService.verifyAsync(token)
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload
    } catch {
      throw new UnauthorizedException('Failed to verify token')
    }
    return true
  }

  /**
   * Extracts the token from the header of a FastifyRequest object.
   *
   * @param {FastifyRequest} request - The FastifyRequest object from which to extract the token.
   * @return {string | undefined} - The extracted token, if it exists, or undefined.
   */
  private extractTokenFromCookie(request: FastifyRequest): string | undefined {
    return request.cookies.access_token
  }
}

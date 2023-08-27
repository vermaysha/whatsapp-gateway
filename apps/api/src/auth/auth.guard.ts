import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE, AuthType } from './auth.decorator'
import { ApiTokenService } from '../api-token/api-token.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private apiTokenService: ApiTokenService,
  ) {}

  /**
   * Authenticates the user based on the provided token in the request header.
   *
   * @param {ExecutionContext} context - The execution context object.
   * @return {Promise<boolean>} Returns `true` if the user is authenticated, otherwise throws an `UnauthorizedException`.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType = this.reflector.getAllAndOverride<AuthType>(AUTH_TYPE, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!authType) {
      return true
    }

    const request = context.switchToHttp().getRequest() as FastifyRequest

    request.user = { uuid: '' }
    const whenValidToken = async (userId: string, tokenId: string) => {
      request.user = {
        uuid: userId,
      }
      // Add token history to the request (async)
      const now = new Date()
      await this.apiTokenService.insertHistory(
        {
          fullpath: request.url,
          userAgent: request.headers['user-agent'],
          ip: request.ip,
          createdAt: now,
          updatedAt: now,
        },
        tokenId,
      )
    }

    if (authType === 'session') {
      if (!this.checkSessionAuth(request)) {
        throw new UnauthorizedException('User must be logged in')
      }
    } else if (authType === 'token') {
      const token = await this.checkTokenAuth(request)
      if (!token) {
        throw new UnauthorizedException('Token must be provided and valid')
      }
      whenValidToken(token.userId, token.tokenId)
    } else if (authType === 'all') {
      const validSession = this.checkSessionAuth(request)
      const token = await this.checkTokenAuth(request)
      if (!(validSession || token)) {
        throw new UnauthorizedException('Token must be provided and valid')
      }
      if (token) {
        whenValidToken(token.userId, token.tokenId)
      }
    }

    return true
  }

  /**
   * Checks if the session is authenticated.
   *
   * @param {FastifyRequest} request - The request object.
   * @return {boolean} Returns true if the session is authenticated, false otherwise.
   */
  checkSessionAuth(request: FastifyRequest): boolean {
    return !!request.session.get<any>('user')
  }

  /**
   * Checks if the provided token is authenticated.
   *
   * @param {FastifyRequest} request - The request object.
   * @return {Promise<boolean>} A boolean indicating whether the token is authenticated.
   */
  async checkTokenAuth(
    request: FastifyRequest,
  ): Promise<false | undefined | { userId: string; tokenId: string }> {
    const token = this.extractTokenFromHeader(request)

    if (!token) return false
    const data = await this.apiTokenService.verifyToken(token)

    if (!data) return false

    return {
      userId: data.userId,
      tokenId: data.id,
    }
  }

  /**
   * Extracts the token from the header of a Fastify request.
   *
   * @param {FastifyRequest} request - The Fastify request object.
   * @return {string | undefined} - The extracted token or undefined if not found.
   */
  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

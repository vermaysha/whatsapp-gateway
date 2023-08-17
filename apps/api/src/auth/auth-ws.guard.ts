import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class AuthWsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Authenticates the user based on the provided token in the request header.
   *
   * @param {ExecutionContext} context - The execution context object.
   * @return {boolean} Returns `true` if the user is authenticated, otherwise throws an `UnauthorizedException`.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient()

    const token = this.extractToken(socket)

    if (!token) {
      throw new WsException({
        code: 401,
        message: 'Unauthorized',
      })
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.ENCRYPTION_KEY,
      })
    } catch (e) {
      throw new WsException({
        code: 400,
        message: 'Invalid token',
      })
    }

    return true
  }

  private extractToken(socket: any): string | null {
    const cookie: string | null | undefined = socket.handshake?.headers?.cookie
    const session = cookie?.match(/wsToken=([^;]+)/)?.[1]

    if (session) return session

    const [type, token] =
      socket.handshake?.headers?.authorization?.split(' ')?.[1]

    if (type === 'Bearer' && token) {
      return token
    }

    return null
  }
}

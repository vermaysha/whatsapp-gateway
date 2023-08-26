import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthWsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Authenticates the user based on the provided token in the request header.
   *
   * @param {ExecutionContext} context - The execution context object.
   * @return {boolean} Returns `true` if the user is authenticated, otherwise throws an `UnauthorizedException`.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>()
    const token = this.extractToken(socket)

    if (!token) {
      throw new WsException({
        code: 401,
        message: 'Unauthorized',
      })
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('encryptionKey'),
      })
    } catch (e) {
      throw new WsException({
        code: 400,
        message: 'Invalid token',
      })
    }

    return true
  }

  /**
   * Extracts the token from the given socket.
   *
   * @param {Socket} socket - The socket object from which to extract the token.
   * @return {string | null} The extracted token, or null if no token is found.
   */
  private extractToken(socket: Socket): string | null {
    const cookie: string | null | undefined = socket.handshake.headers.cookie
    const session = cookie?.match(/wsToken=([^;]+)/)?.[1]

    if (session) return session

    const [type, token] =
      socket.handshake?.headers?.authorization?.split(' ') ?? []

    if (type === 'Bearer' && token) {
      return token
    }

    return null
  }
}

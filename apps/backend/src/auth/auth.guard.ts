import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE, AuthType } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the user can activate the current route.
   *
   * @param {ExecutionContext} context - The execution context.
   * @return {boolean | Promise<boolean> | Observable<boolean>} - Returns a boolean, a promise that resolves to a boolean, or an observable that emits a boolean.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authType = this.reflector.getAllAndOverride<AuthType>(AUTH_TYPE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!authType) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const isSessionValid = () => (request.session.user?.uuid ? true : false);
    const isTokenValid = () => false;

    switch (authType) {
      case 'session':
        if (!isSessionValid())
          throw new UnauthorizedException('User must be logged in');
        break;

      case 'token':
        if (!isTokenValid())
          throw new UnauthorizedException('Token must be provided and valid');
        break;

      case 'all':
        const validSession = isSessionValid();
        const token = isTokenValid();
        if (!(validSession || token))
          throw new UnauthorizedException(
            'User must be logged in or Token must be provided and valid',
          );

        break;
    }

    if (authType === 'session') {
      return isSessionValid();
    } else if (authType === 'token') {
      return isTokenValid();
    } else if (authType === 'all') {
      return isSessionValid() || isTokenValid();
    }

    return true;
  }
}

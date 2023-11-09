import {
  Controller,
  Res,
  Req,
  ForbiddenException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { TypedRoute, TypedBody } from '@nestia/core';
import { SignInDto } from './auth.dto';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Auth } from './auth.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly auth: AuthService) {}

  @TypedRoute.Post('/login')
  /**
   * Signs in a user.
   *
   * @param {SignInDto} body - The sign-in data.
   * @param {Response} res - The response object.
   * @param {Request} req - The request object.
   * @return {Promise<void>} - A promise that resolves when the sign-in process is complete.
   */
  async signIn(
    @TypedBody() body: SignInDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const user = await this.auth.signIn({
        username: body.username,
        password: body.password,
      });

      req.session.user = {
        uuid: user.id,
      };

      res.status(HttpStatus.OK).send({
        message: 'Successfully signed in',
      });
    } catch (error) {
      throw new ForbiddenException(error.message ?? 'Failed to sign in');
    }
  }

  @Auth('session')
  @TypedRoute.Post('/isLoggedIn')
  /**
   * Checks if the user is logged in.
   *
   * @param {@Req()} req - The request object.
   * @param {@Res()} res - The response object.
   * @return {Promise<void>} - The response with the isLoggedIn status.
   */
  async isLoggedIn(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).send({
      isLoggedIn: !!req.session.user,
    });
  }

  @Auth('session')
  @TypedRoute.Post('/logout')
  /**
   * Destroys the session asynchronously.
   *
   * @param {@Req()} req - The request object.
   * @param {@Res()} res - The response object.
   * @return {Promise<void>} A promise that resolves when the session is destroyed.
   */
  async logout(@Req() req: Request, @Res() res: Response) {
    /**
     * Destroys the session asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the session is destroyed.
     */
    const destroy = () => {
      return new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          resolve();
        });

        setTimeout(() => {
          this.logger.error('Failed to destroy session');
        }, 15_000);
      });
    };

    await destroy().catch(() => {});

    res.status(HttpStatus.OK).send({
      message: 'Successfully logged out',
    });
  }
}

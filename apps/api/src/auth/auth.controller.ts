import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  Response,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthGuard } from './auth.guard'
import { SignInDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  /**
   * Sign in with the provided signInDto.
   *
   * @param {SignInDto} signInDto - The signInDto object containing the username and password.
   * @return {any} The result of the authentication process.
   */
  async signIn(@Body() signInDto: SignInDto, @Response() res: FastifyReply) {
    const token = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    )

    res.setCookie('ACCESS_TOKEN', token.access_token)

    res.send(token)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  /**
   * Retrieves the user profile.
   *
   * @param {FastifyRequest & { user: Users | null }} req - The request object containing the user information.
   * @param {FastifyReply} res - The response object used to send the user profile.
   * @return {void} The user profile is sent as the response.
   */
  getProfile(@Request() req: FastifyRequest, @Response() res: FastifyReply) {
    res.send(req.user)
  }
}

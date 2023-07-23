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
  Delete,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthGuard } from './auth.guard'
import { SignInDto } from './auth.dto'
import { Auth } from './auth.decorator'

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

    res.setCookie('access_token', token.access_token)

    res.send(token)
  }

  @Auth()
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

  @Auth()
  @Get('verify')
  /**
   * Verify the request and send a response.
   *
   * @param {Response} res - The response object.
   * @return {void} The response status.
   */
  verify(@Response() res: FastifyReply) {
    res.send({
      status: true,
    })
  }

  @Auth()
  @Delete('logout')
  /**
   * Logs out the user by clearing the access token cookie and sending a success response.
   *
   * @param {FastifyReply} res - The response object.
   * @param {FastifyRequest} req - The request object.
   * @return {void} No return value.
   */
  logout(@Response() res: FastifyReply, @Request() req: FastifyRequest) {
    res.clearCookie('access_token')
    res.send({
      status: true,
    })
  }
}

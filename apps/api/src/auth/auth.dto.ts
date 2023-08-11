export class SignInDto {
  /**
   * The username of the user to sign in.
   *
   * @pattern ^[a-zA-Z0-9\-_.]+$
   * @minLength 4
   */
  username: string

  /**
   * The password of the user to sign in.
   *
   * @minLength 8
   */
  password: string
}

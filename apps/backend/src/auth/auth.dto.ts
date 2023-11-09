import { tags } from 'typia';

export class SignInDto {
  /**
   * The username of the user to sign in.
   *
   */
  username: string & tags.Pattern<'^[a-zA-Z0-9-_.]+$'> & tags.MinLength<4>;

  /**
   * The password of the user to sign in.
   *
   */
  password: string & tags.MinLength<6>;
}

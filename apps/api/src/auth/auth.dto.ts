import { Type } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  username: string

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  password: string
}

import { Type } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class DefaultDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  deviceId: string
}

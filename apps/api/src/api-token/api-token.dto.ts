import { Type } from 'class-transformer'
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class ApiTokenListDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  perPage?: number
}

export class ApitTokenDetailDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  id: string
}

export class ApiTokenCreateDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  name: string

  @IsOptional()
  @IsString()
  @Type(() => String)
  description?: string

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  expiredAt?: Date
}

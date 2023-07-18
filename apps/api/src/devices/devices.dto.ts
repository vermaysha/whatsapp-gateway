import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ListDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  perPage?: number
}

export class DetailDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  id: string
}

export class UpdateDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string
}

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  name: string
}

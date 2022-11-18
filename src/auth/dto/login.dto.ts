import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
  // phone number or email
  @IsNotEmpty()
  @Transform(({value}) => value.toLowerCase())
  identifier: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

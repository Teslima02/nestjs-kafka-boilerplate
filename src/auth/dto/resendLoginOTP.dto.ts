import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ResendLoginOTPDto {
  // phone number or email
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  identifier: string;
}

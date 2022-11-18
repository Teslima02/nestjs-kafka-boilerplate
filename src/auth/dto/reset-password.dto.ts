import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  resetPasswordToken: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, {
    message: 'password too weak',
  })
  newPassword: string;
}

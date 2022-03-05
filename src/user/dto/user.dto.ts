import { PartialType, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateNewUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    {
      message: 'Invalid email',
    },
  )
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/, {
    message: 'password too weak',
  })
  password: string;
}

export class UpdateUserProfileDto extends PartialType(
  OmitType(CreateNewUserDto, ['email'] as const),
) {}

export class OtpDto {
  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  exp: Date;
}

export class OtpVerificationDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class OtpResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  emailConfirmationOtpExpiringTime: Date;

  @IsNotEmpty()
  @IsString()
  emailOtpStatus?: boolean;
}

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  emailAuthentication?: boolean;

  @IsNotEmpty()
  @IsString()
  isEmailVerify?: boolean;
}

export class UserResponseWithCredentialsDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  emailAuthentication?: boolean;

  @IsNotEmpty()
  @IsString()
  isEmailVerify?: boolean;
}

export class CurrentUserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsString()
  emailAuthentication?: boolean;

  @IsNotEmpty()
  @IsString()
  isEmailVerify?: boolean;
}

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

export class UserBasicDetailsDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone?: string;

  @IsBoolean()
  emailAuthentication?: boolean;

  @IsBoolean()
  phoneAuthentication?: boolean;

  @IsBoolean()
  isEmailVerify?: boolean;

  @IsBoolean()
  isPhoneVerify?: boolean;
}

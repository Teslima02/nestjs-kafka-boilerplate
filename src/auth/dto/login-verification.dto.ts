import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginOtpVerificationDto {
    @IsNotEmpty()
    @IsString()
    otp: string;

    @IsNotEmpty()
    identifier: string;

    @IsOptional()
    ipAddress?: string;
  
    @IsOptional()
    deviceInfo?: string;
  
    @IsOptional()
    geoData?: string;
  }
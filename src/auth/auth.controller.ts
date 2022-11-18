import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateNewUserDto, LoginDto, LoginWithRocketDto } from './dto/auth.dto';
import {
  CreateNewUserResponseDto,
  LoginOTPResponseDto,
  LoginVerificationDto,
  LoginVerificationResponseDto,
} from './dto/authResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto copy';
import { CurrentUserResponseDto } from '../user/dto/user.dto';
import { CurrentUser } from './passport/user.decorator';
import { AppResponse } from 'src/common/helpers/appresponse';
import { Ok } from 'src/common/helpers/rckgResponseType';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ description: 'Register with email' })
  @Post('/register')
  async createNewUser(
    @Body() createNewUser: CreateNewUserDto,
  ): Promise<Ok<CreateNewUserResponseDto>> {
    return await this.userService.createNewUser(createNewUser);
  }

  @ApiOperation({ description: 'Login with email' })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<Ok<LoginOTPResponseDto>> {
    const resp = await this.authService.login(loginDto);
    return AppResponse.OkSuccess(resp, 'Login successfully', HttpStatus.OK);
  }

  @ApiOperation({ description: 'Login with rocket' })
  @Post('/login-rocket')
  async loginWithRocket(
    @Body() loginWithRocketDto: LoginWithRocketDto,
  ): Promise<Ok<LoginOTPResponseDto>> {
    const resp = await this.authService.loginWithRocket(loginWithRocketDto);
    return AppResponse.OkSuccess(resp, '', HttpStatus.OK);
  }

  @ApiOperation({ description: 'Get current user profile' })
  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(AuthGuard())
  async currentUser(
    @CurrentUser() currentUser: CurrentUserResponseDto,
  ): Promise<Ok<CurrentUserResponseDto>> {
    console.log(currentUser, 'currentUser');
    const resp = await this.userService.me(currentUser.id);
    return AppResponse.OkSuccess(resp, 'User Details', HttpStatus.OK);
  }

  @ApiOperation({ description: 'Login otp verification' })
  @Post('/login/verify-otp')
  async loginOtpVerification(
    @Body() otpDto: LoginVerificationDto,
  ): Promise<Ok<LoginVerificationResponseDto>> {
    const resp = await this.authService.verifyLoginOtp(otpDto);
    return AppResponse.OkSuccess(
      resp,
      'Otp Verification Successful',
      HttpStatus.OK,
    );
  }

  @ApiOperation({ description: 'Forget password' })
  @Post('/forgot-password')
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<any> {
    await this.userService.forgetPassword(forgetPasswordDto.email);
    return AppResponse.OkSuccess(
      { status: true },
      'Check your email to reset your password',
      HttpStatus.OK,
    );
  }

  @ApiOperation({ description: 'Reset password' })
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    await this.userService.resetPassword(resetPasswordDto);
    return AppResponse.OkSuccess(
      { status: true },
      'Password reset successful',
      HttpStatus.OK,
    );
  }
}

import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Ok } from 'rckg-shared-library/lib/response/rckgResponseType';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateNewUserDto, LoginDto, LoginWithRocketDto } from './dto/auth.dto';
import {
  CreateNewUserResponseDto,
  LoginOTPResponseDto,
  LoginVerificationDto,
  LoginVerificationResponseDto,
} from './dto/authResponse.dto';
import { RckgAppResponse } from 'rckg-shared-library';
import { AuthGuard } from '@nestjs/passport';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto copy';
import { CurrentUserResponseDto } from '../user/dto/user.dto';
import { CurrentUser } from './passport/user.decorator';

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
    return RckgAppResponse.Ok(resp);
  }

  @ApiOperation({ description: 'Login with rocket' })
  @Post('/login-rocket')
  async loginWithRocket(
    @Body() loginWithRocketDto: LoginWithRocketDto,
  ): Promise<Ok<LoginOTPResponseDto>> {
    const resp = await this.authService.loginWithRocket(loginWithRocketDto);
    return RckgAppResponse.Ok(resp);
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
    return RckgAppResponse.Ok(resp, 'User Details');
  }

  @ApiOperation({ description: 'Login otp verification' })
  @Post('/login/verify-otp')
  async loginOtpVerification(
    @Body() otpDto: LoginVerificationDto,
  ): Promise<Ok<LoginVerificationResponseDto>> {
    const resp = await this.authService.verifyLoginOtp(otpDto);
    return RckgAppResponse.Ok(resp, 'Otp Verification Successful');
  }

  @ApiOperation({ description: 'Get rocket user profile' })
  @Post('/rocket-me')
  async getRocketUserProfile(
    @Body() loginWithRocketDto: LoginWithRocketDto,
  ): Promise<Ok<LoginOTPResponseDto>> {
    const resp = await this.authService.loginWithRocket(loginWithRocketDto);
    return RckgAppResponse.Ok(resp);
  }

  @ApiOperation({ description: 'Forget password' })
  @Post('/forgot-password')
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<any> {
    await this.userService.forgetPassword(forgetPasswordDto.email);
    return RckgAppResponse.Ok(
      { status: true },
      'Check your email to reset your password',
    );
  }

  @ApiOperation({ description: 'Reset password' })
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    await this.userService.resetPassword(resetPasswordDto);
    return RckgAppResponse.Ok({ status: true }, 'Password reset successful');
  }
}

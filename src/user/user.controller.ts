import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateNewUserDto,
  OtpResponseDto,
  OtpVerificationDto,
  UpdateUserProfileDto,
  UserResponseDto,
} from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Ok } from '../common/helpers/rckgResponseType';
import { AppResponse } from '../common/helpers/appresponse';
/**
 * endpoints to manage users
 */
@ApiTags('users')
@Controller('v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ description: 'Register new user with email' })
  @Post()
  async createNewUser(@Body() createNewUser: CreateNewUserDto) {
    return await this.userService.createNewUser(createNewUser);
  }

  @ApiOperation({ description: 'Resend Otp verification' })
  @Get('/:email/otp/resend')
  async resendOtp(@Param('email') email: string): Promise<Ok<OtpResponseDto>> {
    const resp = await this.userService.resendOtp(email);
    return AppResponse.OkSuccess(resp, 'OTP resend', HttpStatus.OK);
  }

  @ApiOperation({ description: 'send Otp verification' })
  @Post('/otp/verification')
  async otpVerification(
    @Body() otpVerification: OtpVerificationDto,
  ): Promise<Ok<UserResponseDto>> {
    const resp = await this.userService.otpVerification(otpVerification);
    return AppResponse.OkSuccess(resp, 'OTP resend', HttpStatus.OK);
  }

  @ApiOperation({ description: 'Otp verification' })
  @Patch('/update/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async updateUserDetails(
    @Param('userId') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<Ok<UserResponseDto>> {
    const resp = await this.userService.updateUserProfile(
      userId,
      updateUserProfileDto,
    );
    return AppResponse.OkSuccess(resp, 'Email verified', HttpStatus.OK);
  }
}

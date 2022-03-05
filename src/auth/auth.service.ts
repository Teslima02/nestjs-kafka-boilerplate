import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RckgAppResponse } from 'rckg-shared-library';
import { generateOTP } from '../common/helpers/global';
import { User } from '../entities/user.entity';
import { EmailService } from '../user/email.service';
import { getRepository } from 'typeorm';
import { UserService } from '../user/user.service';
import { LoginDto, LoginWithRocketDto } from './dto/auth.dto';
import {
  LoginOTPResponseDto,
  LoginVerificationDto,
  LoginVerificationResponseDto,
} from './dto/authResponse.dto';
import { TokenService } from 'src/user/token.service';
import { AuthRepository } from './authRepository';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { configConstant } from '../common/constants/config.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginOTPResponseDto> {
    const findUser = await this.userService.findUserByEmailWithCredentials(
      loginDto.email,
    );

    if (!findUser) {
      throw new NotFoundException(
        RckgAppResponse.NotFoundRequest('Incorrect email or password'),
      );
    }
    // Throw Error if use has not verified email
    if (!findUser.emailAuthentication)
      throw new BadRequestException(
        RckgAppResponse.BadRequest(
          'Unable to Login. Verify your Email before Login',
        ),
      );

    const isValidPassword = await this.tokenService.comparedPassword(
      loginDto.password,
      findUser.password,
    );
    if (!isValidPassword)
      throw new BadRequestException(
        RckgAppResponse.BadRequest('Incorrect email or password'),
      );
    const { otp, exp } = generateOTP();
    //determine if otp should be sent to email of phone
    if (findUser.emailAuthentication) {
      await this.emailService.emailServiceToSendLoginOTP(findUser.email, otp);
    }

    findUser.otpConfirmation = otp;
    findUser.otpConfirmationExpirationTime = exp;
    await getRepository(User).save(findUser);
    return { otpExpiration: exp, message: 'Login Otp Sent' };
  }

  async loginWithRocket(
    loginWithRocketDto: LoginWithRocketDto,
  ): Promise<LoginOTPResponseDto> {
    try {
      const response = await axios.post(
        `${this.configService.get(
          configConstant.rocketGlobalBaseUrl,
        )}/users/v2/auths/login`,
        {
          email: loginWithRocketDto.email,
          password: loginWithRocketDto.password,
          isMobile: loginWithRocketDto.isMobile,
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
    // const findUser = await this.userService.findUserByEmailWithCredentials(
    //   loginDto.email,
    // );

    // if (!findUser) {
    //   throw new NotFoundException(
    //     RckgAppResponse.NotFoundRequest('Incorrect email or password'),
    //   );
    // }
    // // Throw Error if use has not verified email
    // if (!findUser.emailAuthentication)
    //   throw new BadRequestException(
    //     RckgAppResponse.BadRequest(
    //       'Unable to Login. Verify your Email before Login',
    //     ),
    //   );

    // const isValidPassword = await this.tokenService.comparedPassword(
    //   loginDto.password,
    //   findUser.password,
    // );
    // if (!isValidPassword)
    //   throw new BadRequestException(
    //     RckgAppResponse.BadRequest('Incorrect email or password'),
    //   );
    // const { otp, exp } = generateOTP();
    // //determine if otp should be sent to email of phone
    // if (findUser.emailAuthentication) {
    //   await this.emailService.emailServiceToSendLoginOTP(findUser.email, otp);
    // }

    // findUser.otpConfirmation = otp;
    // findUser.otpConfirmationExpirationTime = exp;
    // await getRepository(User).save(findUser);
    // return { otpExpiration: exp, message: 'Login Otp Sent' };
  }

  async verifyLoginOtp(
    otpVerifyDto: LoginVerificationDto,
  ): Promise<LoginVerificationResponseDto> {
    const findUser = await this.authRepository.findUserByEmail(
      otpVerifyDto.email,
    );
    if (!findUser) {
      throw new NotFoundException(
        RckgAppResponse.NotFoundRequest('invalid or expired otp'),
      );
    }
    if (new Date() > findUser.otpConfirmationExpirationTime)
      throw new BadRequestException(
        RckgAppResponse.BadRequest('invalid or expired otp'),
      );
    if (findUser.otpConfirmation !== otpVerifyDto.otp)
      throw new BadRequestException(
        RckgAppResponse.BadRequest('invalid or expired otp'),
      );
    return await this.tokenService.createToken(findUser.id, findUser.email);
  }
}

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import {
  createUserWithEmailInput,
  createUserWithPhoneNumberInput,
  mockUserDetails,
  otpVerificationForEmailDtoInput,
  otpVerificationForPhoneNumberDtoInput,
  phoneNumberVerifyDtoInput,
  wrongOtpVerificationForEmailDtoInput,
  wrongOtpVerificationForPhoneNumberDtoInput,
} from '../auth/dto/authTestFeatures.dto';
import { configConstant } from '../common/constants/config.constant';
import { passportModule } from '../common/helpers/global';
import { SharedModule } from '../common/module/shared.module';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserRepository } from './userRepository';

describe('User Service', () => {
  let userController: UserController;
  let userService: UserService;
  let userModel: UserRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule, passportModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get(configConstant.database.host),
            port: +configService.get<number>(configConstant.database.port),
            username: configService.get(configConstant.database.username),
            password: configService.get(configConstant.database.password),
            database: configService.get(configConstant.testDB.name),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false,
            keepConnectionAlive: true,
          }),
          inject: [ConfigService],
        }),
        passportModule,
        SharedModule,
        UserModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: jest.fn().mockResolvedValue([{}]),
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userModel = module.get<UserRepository>(UserRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await userModel.delete({});
  });

  it('should create account with email', async () => {
    const newUserWithEmail = await userService.createUserWithEmail(
      createUserWithEmailInput,
    );
    expect(newUserWithEmail.data['email']).toBe(createUserWithEmailInput.email);
  });

  it('should create account with phone number', async () => {
    const newUserWithPhone = await userService.createUserWithPhone(
      createUserWithPhoneNumberInput,
    );
    expect(newUserWithPhone.data['email']).toBe(
      createUserWithPhoneNumberInput.email,
    );
    expect(newUserWithPhone.data['phone']).toBe(
      createUserWithPhoneNumberInput.phone,
    );
  });

  it('should generate otp when create new user with email', async () => {
    const newUserWithEmail = await userService.createUserWithEmail(
      createUserWithEmailInput,
    );
    expect(newUserWithEmail.data['email']).toBe(createUserWithEmailInput.email);
    expect(newUserWithEmail.data['emailConfirmationOtp']).toBe(
      configService.get(configConstant.otp),
    );
  });

  it('should generate otp when create new user with phone', async () => {
    const newUserWithPhone = await userService.createUserWithPhone(
      createUserWithPhoneNumberInput,
    );
    expect(newUserWithPhone.data['email']).toBe(
      createUserWithPhoneNumberInput.email,
    );
    expect(newUserWithPhone.data['phone']).toBe(
      createUserWithPhoneNumberInput.phone,
    );
    expect(newUserWithPhone.data['phoneNumberConfirmationOtp']).toBe(
      configService.get(configConstant.otp),
    );
  });

  it('should verify otp for email', async () => {
    await userService.createUserWithEmail(createUserWithEmailInput);
    const otpVerificationForEmail = await userService.otpVerification(
      otpVerificationForEmailDtoInput,
    );
    expect(otpVerificationForEmail.data['isEmailVerify']).toBe(true);
  });

  it('should verify otp for phone number', async () => {
    await userService.createUserWithPhone(createUserWithPhoneNumberInput);
    const otpVerificationForPhoneNumber = await userService.otpVerification(
      otpVerificationForPhoneNumberDtoInput,
    );
    expect(otpVerificationForPhoneNumber.data['isPhoneVerify']).toBe(true);
  });

  it('should resend otp', async () => {
    await userService.createUserWithPhone(createUserWithPhoneNumberInput);
    const resendOtpVerificationForPhoneNumber = await userService.resendOtp(
      otpVerificationForPhoneNumberDtoInput.emailOrPhoneNumber,
    );
    expect(resendOtpVerificationForPhoneNumber.data['isPhoneVerify']).toBe(
      true,
    );
  });

  it('should send phone number verification OTP', async () => {
    const sendPhoneNumberOTP = await userService.sendPhoneVerificationOTP(
      phoneNumberVerifyDtoInput.phoneNumber,
      mockUserDetails,
    );
    expect(sendPhoneNumberOTP).toBe(
      `Otp has been sent to ****${mockUserDetails.phone.slice(
        mockUserDetails.phone.length - 3,
      )}`,
    );
  });
});

describe('User Service failed response', () => {
  let userController: UserController;
  let userService: UserService;
  let userModel: UserRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule, passportModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get(configConstant.database.host),
            port: +configService.get<number>(configConstant.database.host),
            username: configService.get(configConstant.database.username),
            password: configService.get(configConstant.database.password),
            database: configService.get(configConstant.testDB.name),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false,
            keepConnectionAlive: true,
          }),
          inject: [ConfigService],
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        SharedModule,
        UserModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: jest.fn().mockResolvedValue([{}]),
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userModel = module.get<UserRepository>(UserRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await userModel.delete({});
  });

  it('should throw error if user try to create account with existing email', async () => {
    await userService.createUserWithEmail(createUserWithEmailInput);
    expect(async () => {
      await userService.createUserWithEmail(createUserWithEmailInput);
    }).rejects.toThrow();
  });

  it('should throw error if user try to create account with existing email', async () => {
    await userService.createUserWithPhone(createUserWithPhoneNumberInput);
    expect(async () => {
      await userService.createUserWithPhone(createUserWithPhoneNumberInput);
    }).rejects.toThrow();
  });

  it('should throw error if otp is not valid for email', async () => {
    await userService.createUserWithPhone(createUserWithPhoneNumberInput);
    expect(async () => {
      await userService.otpVerification(wrongOtpVerificationForEmailDtoInput);
    }).rejects.toThrow();
  });

  it('should throw error if otp is not valid for phone number', async () => {
    await userService.createUserWithPhone(createUserWithPhoneNumberInput);
    expect(async () => {
      await userService.otpVerification(
        wrongOtpVerificationForPhoneNumberDtoInput,
      );
    }).rejects.toThrow();
  });
});

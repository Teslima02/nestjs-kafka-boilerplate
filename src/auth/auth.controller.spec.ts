import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configConstant } from '../common/constants/config.constant';
import { passportModule } from '../common/helpers/global';
import { SharedModule } from '../common/module/shared.module';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/userRepository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  createUserWithEmailInput,
  createUserWithPhoneNumberInput,
} from './dto/authTestFeatures.dto';

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;
  let userModel: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userModel = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await userModel.delete({});
  });

  it('should create new user with email', async () => {
    const newUserWithEmail = await controller.createUserWithEmail(
      createUserWithEmailInput,
    );

    const expectedResult = JSON.parse(JSON.stringify(newUserWithEmail.data));
    expect(expectedResult.email).toBe(createUserWithEmailInput.email);
  });

  it('should create new user with phone', async () => {
    const newUserWithPhone = await controller.createUserWithPhone(
      createUserWithPhoneNumberInput,
    );
    const expectedResult = JSON.parse(JSON.stringify(newUserWithPhone.data));
    expect(expectedResult.email).toBe(createUserWithPhoneNumberInput.email);
    expect(expectedResult.phone).toEqual(createUserWithPhoneNumberInput.phone);
  });
});

describe('Auth Controller failed response', () => {
  let controller: AuthController;
  let service: AuthService;
  let userModel: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
      exports: [],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userModel = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await userModel.delete({});
  });

  it('should create new user with email', async () => {
    await controller.createUserWithEmail(createUserWithEmailInput);
    expect(async () => {
      await controller.createUserWithEmail(createUserWithEmailInput);
    }).rejects.toThrow();
  });

  it('should create new user with phone', async () => {
    await controller.createUserWithPhone(createUserWithPhoneNumberInput);
    expect(async () => {
      await controller.createUserWithPhone(createUserWithPhoneNumberInput);
    }).rejects.toThrow();
  });
});

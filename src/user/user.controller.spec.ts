import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configConstant } from '../common/constants/config.constant';
import { passportModule } from '../common/helpers/global';
import { SharedModule } from '../common/module/shared.module';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserRepository } from './userRepository';

describe('User Controller', () => {
  let userController: UserController;
  let userService: UserService;
  let userModel: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
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
          provide: UserService,
          useValue: jest.fn().mockResolvedValue([{}]),
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userModel = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await userModel.delete({});
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});

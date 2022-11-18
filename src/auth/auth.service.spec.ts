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

describe('Auth Service', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userModel: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
            synchronize: true,
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
    authService = module.get<AuthService>(AuthService);
    userModel = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await userModel.delete({});
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});

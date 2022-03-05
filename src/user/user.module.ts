import { UserRepository } from './userRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './../common/module/shared.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from './email.service';
import { SMSService } from './sms.service';
import { TokenService } from './token.service';
import { JWTService } from '../auth/passport/jwt.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UserService, EmailService, SMSService, TokenService, JWTService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

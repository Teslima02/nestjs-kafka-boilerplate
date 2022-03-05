import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { JWTService } from './passport/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from '../user/token.service';
import { EmailService } from '../user/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from './authRepository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JWTService, TokenService, EmailService],
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    TypeOrmModule.forFeature([AuthRepository]),
  ],
})
export class AuthModule {}

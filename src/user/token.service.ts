import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const bcrypt = require('bcrypt');
import { JWTService } from 'src/auth/passport/jwt.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JWTService,
    private readonly configService: ConfigService,
  ) {}

  async createToken(id: string, email: string): Promise<any> {
    return await this.jwtService.createToken({ id, email });
  }

  async comparedPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

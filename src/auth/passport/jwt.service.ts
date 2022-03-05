import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { configConstant } from '../../common/constants/config.constant';

@Injectable()
export class JWTService {
  constructor(private readonly configService: ConfigService) {}
  async createToken(jwtPayload: JwtPayload, roles?: string) {
    if (jwtPayload.email) {
      const expiresIn = this.configService.get(configConstant.expireIn);
      const secretOrKey = this.configService.get(configConstant.jwtSecret);
      console.log(secretOrKey, 'secretOrKey');
      const userInfo = jwtPayload;
      const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
      return {
        expires_in: expiresIn,
        access_token: token,
      };
    }
  }
}

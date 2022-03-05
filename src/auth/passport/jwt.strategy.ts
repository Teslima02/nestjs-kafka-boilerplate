import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { configConstant } from '../../common/constants/config.constant';
import { ConfigService } from '@nestjs/config';
import { CurrentUserResponseDto } from '../../user/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(configConstant.jwtSecret),
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserResponseDto> {
    const user = await this.userService.me(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenPayload } from './dto/token.dto';
import { AuthService } from './auth.service';
import { VolunteerNotFoundError } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.findUserById(payload.sub);

    if (!user) throw new NotFoundException(VolunteerNotFoundError);

    return {
      username: user.username,
      sub: payload.sub,
      isAdmin: user.isAdmin,
    } as TokenPayload;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayloadDto } from './dto/token.dto';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Injectable()
export class AdminJwtStrategy extends JwtStrategy {
  constructor(protected readonly authService: AuthService) {
    super(authService);
  }

  async validate(payload: TokenPayloadDto) {
    return super.validate(payload).then((validPayload) => {
      if (!validPayload.isAdmin) throw new UnauthorizedException();
      return validPayload;
    });
  }
}

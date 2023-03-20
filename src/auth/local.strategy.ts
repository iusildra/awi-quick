import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VolunteerNotFoundError } from './constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    Logger.log(`User ${email} trying to log in`);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new NotFoundException(VolunteerNotFoundError);
    }
    return user;
  }
}

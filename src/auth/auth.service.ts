import { Injectable, Logger } from '@nestjs/common';
import { VolunteerService } from '../volunteer/volunteer.service';
import { SignupDto } from '../volunteer/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { Volunteer } from '../entities/volunteer.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly volunteersService: VolunteerService) {}

  findByMail(identification: string) {
    return this.volunteersService.findByMailOrUsername(identification);
  }

  findByUsername(identification: string) {
    return this.volunteersService.findByMailOrUsername(identification);
  }

  registerUser(user: SignupDto) {
    return this.volunteersService.create(user);
  }

  async validateUser(identification: string, pwd: string) {
    const user = await this.volunteersService.findByMailOrUsername(
      identification,
    );
    const res = await bcrypt.compare(pwd, user.password);

    Logger.debug(`User ${user.username} is valid: ${res}`);
    if (res) return { id: user.id, username: user.username, email: user.email };
    else return undefined;
  }

  // TODO use jwtService.sign(payload) instead
  async login(user: Volunteer) {
    const payload = {
      username: user.username,
      userId: user.id,
      isAdmin: user.isAdmin,
    };

    return {
      access_token: jwt.sign(payload, process.env.JWTKEY, {
        expiresIn: '6h',
      }),
    };
  }
}

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { VolunteerService } from '../volunteer/volunteer.service';
import { SignupDto } from '../volunteer/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token.dto';
import { volunteer } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => VolunteerService))
    private readonly volunteersService: VolunteerService,
    private jwtService: JwtService,
  ) {}

  findUserById(id: string) {
    return this.volunteersService.findUnique(id);
  }

  registerUser(user: SignupDto) {
    return this.volunteersService.create(user);
  }

  async validateUser(identification: string, pwd: string) {
    const user = await this.volunteersService.findByMail(identification);
    if (!user) return null;

    const res = await bcrypt.compare(pwd, user.password);
    if (res) return { id: user.id, username: user.username, email: user.email };
    else return null;
  }

  async login(user: volunteer) {
    return this.volunteersService.findUnique(user.id).then((volunteer) => {
      const payload: TokenPayloadDto = {
        username: volunteer.username,
        email: volunteer.email,
        sub: volunteer.id,
        isAdmin: volunteer.isAdmin,
      };

      return {
        ...payload,
        access_token: this.jwtService.sign(payload),
      };
    });
  }
}

import { Injectable } from '@nestjs/common';
import { VolunteerService } from '../volunteer/volunteer.service';
import { SignupDto } from '../volunteer/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { Volunteer } from '../entities/volunteer.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly volunteersService: VolunteerService,
    private jwtService: JwtService,
  ) {}

  findUserById(id: string) {
    return this.volunteersService.findOne(id);
  }

  registerUser(user: SignupDto) {
    return this.volunteersService.create(user);
  }

  async validateUser(identification: string, pwd: string) {
    const user = await this.volunteersService.findByMailOrUsername(
      identification,
    );
    if (!user) return null;

    const res = await bcrypt.compare(pwd, user.password);
    if (res) return { id: user.id, username: user.username, email: user.email };
    else return null;
  }

  async login(user: Volunteer) {
    const payload: TokenPayloadDto = {
      username: user.username,
      sub: user.id,
      isAdmin: user.isAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import {
  Controller,
  Post,
  Request,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignupDto } from '../volunteer/dto/signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.gard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body(new ValidationPipe()) signupDto: SignupDto) {
    const { email, password } = signupDto;

    const userMailExists = await this.authService.findByMail(email);
    if (userMailExists) throw new ConflictException('User already exists');

    const usernameExists = await this.authService.findByUsername(email);
    if (usernameExists) throw new ConflictException('Username already exists');

    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        return this.authService.registerUser({
          ...signupDto,
          password: hash,
        });
      })
      .then((user) => {
        const payload = { username: user.username };
        return jwt.sign(payload, process.env.JWTKEY, {
          expiresIn: '6h',
        });
      });
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

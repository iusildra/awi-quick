import {
  Controller,
  Post,
  Request,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../volunteer/dto/signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.gard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  signup(@Body(new ValidationPipe()) signupDto: SignupDto) {
    const { password } = signupDto;

    return bcrypt
      .hash(password, 10)
      .then((hash) =>
        this.authService.registerUser({
          ...signupDto,
          password: hash,
        }),
      )
      .then((user) => this.authService.login(user));
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}

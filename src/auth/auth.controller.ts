import {
  Controller,
  Post,
  Request,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../volunteer/dto/signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.gard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  signup(@Body(new ValidationPipe()) signupDto: SignupDto) {
    const password = signupDto.password;

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
  @Get('signin')
  login(@Request() req: any) {
    Logger.log(`User ${req.user.username} logged in`);
    return this.authService.login(req.user);
  }
}

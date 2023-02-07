import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Volunteer } from '../entities';
import SignupDto from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(Volunteer)
    private readonly userModel: typeof Volunteer,
  ) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignupDto) {
    const { username, password } = signupDto;

    const userExists = await this.userModel.findOne({ where: { username } });
    if (userExists) {
      throw new HttpException(
        'Volunteer already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      username,
      password: hashedPassword,
    });

    const payload = { username: user.username };
    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '1h',
    });

    return { accessToken };
  }
}

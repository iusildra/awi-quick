import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response, NextFunction } from 'express';
import { Volunteer } from '../../entities/volunteer.entity';
import { VolunteerService } from '../volunteer.service';

@Injectable()
export class CheckExistingMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Volunteer)
    private readonly volunteerModel: typeof Volunteer,
    private volunteerService: VolunteerService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { email, username } = req.body;

    const existingEmail = await this.volunteerService.findByMail(email);

    if (existingEmail)
      throw new HttpException('Email already taken', HttpStatus.CONFLICT);

    const existingUsername = await this.volunteerService.findByUsername(
      username,
    );

    if (existingUsername)
      throw new HttpException('Username already taken', HttpStatus.CONFLICT);

    next();
  }
}

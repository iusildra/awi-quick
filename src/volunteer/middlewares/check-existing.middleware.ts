import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { VolunteerService } from '../volunteer.service';

@Injectable()
export class CheckExistingMiddleware implements NestMiddleware {
  constructor(private volunteerService: VolunteerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { email, username } = req.body;

    const existingEmail = await this.volunteerService.findByMail(email);

    if (existingEmail) throw new ConflictException('Email already taken');

    const existingUsername = await this.volunteerService.findByUsername(
      username,
    );

    if (existingUsername) throw new ConflictException('Username already taken');

    next();
  }
}

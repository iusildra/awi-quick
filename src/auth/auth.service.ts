import { Injectable } from '@nestjs/common';
import { VolunteerService } from '../volunteer/volunteer.service';
import { GetVolunteerDto } from '../volunteer/dto/get-volunteer.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(private readonly volunteersService: VolunteerService) {}

  //TODO: hash password
  async validateUser(email: string, pass: string): Promise<GetVolunteerDto> {
    const user = await this.volunteersService.findByMail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

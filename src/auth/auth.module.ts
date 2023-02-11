import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Volunteer } from 'src/entities';
import { VolunteerModule } from '../volunteer/volunteer.module';

@Module({
  imports: [VolunteerModule, SequelizeModule.forFeature([Volunteer])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

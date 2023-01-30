import { Module } from '@nestjs/common';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Volunteer } from './entities/volunteer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Volunteer])],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}

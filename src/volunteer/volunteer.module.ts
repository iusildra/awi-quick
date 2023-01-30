import { Module } from '@nestjs/common';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { VolunteerModel } from 'src/model/volunteer.model';

@Module({
  imports: [SequelizeModule.forFeature([VolunteerModel])],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}

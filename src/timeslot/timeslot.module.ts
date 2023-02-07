import { Module } from '@nestjs/common';
import { TimeslotService } from './timeslot.service';
import { TimeslotController } from './timeslot.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Timeslot } from '../entities/timeslot.entity';

@Module({
  imports: [SequelizeModule.forFeature([Timeslot])],
  controllers: [TimeslotController],
  providers: [TimeslotService],
})
export class TimeslotModule {}

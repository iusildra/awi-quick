import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Volunteer } from '../entities/volunteer.entity';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CheckAvailabilityMiddleware } from './middlewares/check-availability.middleware';
import { VolunteerAssignment } from '../entities/volunteer-assignment.entity';
import { Timeslot } from '../entities/timeslot.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Volunteer]),
    SequelizeModule.forFeature([VolunteerAssignment]),
    SequelizeModule.forFeature([Timeslot]),
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckAvailabilityMiddleware).forRoutes({
      path: 'volunteer/:id/assign/:zoneId/:zoneNumber',
      method: RequestMethod.POST,
    });
  }
}

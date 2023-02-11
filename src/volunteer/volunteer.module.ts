import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Timeslot, Volunteer, VolunteerAssignment, Zone } from '../entities';
import { CheckAvailabilityMiddleware } from './middlewares/check-availability.middleware';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { CheckExistingMiddleware } from './middlewares/check-existing.middleware';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Timeslot,
      Volunteer,
      VolunteerAssignment,
      Zone,
    ]),
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckAvailabilityMiddleware).forRoutes({
      path: 'volunteer/:id/assign/:zoneId',
      method: RequestMethod.POST,
    });
    consumer.apply(CheckExistingMiddleware).forRoutes({
      path: 'volunteer/',
      method: RequestMethod.POST,
    });
  }
}

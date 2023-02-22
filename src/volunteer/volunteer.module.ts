import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CheckAvailabilityMiddleware } from './middlewares/check-availability.middleware';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { CheckExistingMiddleware } from './middlewares/check-existing.middleware';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService],
})
export class VolunteerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckAvailabilityMiddleware).forRoutes({
      path: 'volunteer/:id/assign/:tableId',
      method: RequestMethod.POST,
    });
    consumer.apply(CheckExistingMiddleware).forRoutes({
      path: 'volunteer/',
      method: RequestMethod.POST,
    });
  }
}

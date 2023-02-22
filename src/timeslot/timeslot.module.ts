import { Module } from '@nestjs/common';
import { TimeslotService } from './timeslot.service';
import { TimeslotController } from './timeslot.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TimeslotController],
  providers: [TimeslotService],
  exports: [TimeslotService],
})
export class TimeslotModule {}

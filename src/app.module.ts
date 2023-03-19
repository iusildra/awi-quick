import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VolunteerModule } from './volunteer/volunteer.module';
import { ZoneModule } from './zone/zone.module';
import { TimeslotModule } from './timeslot/timeslot.module';
import { AuthModule } from './auth/auth.module';
import { FestivalModule } from './festival/festival.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VolunteerModule,
    ZoneModule,
    TimeslotModule,
    AuthModule,
    FestivalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

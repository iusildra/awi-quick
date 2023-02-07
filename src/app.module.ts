import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VolunteerModule } from './volunteer/volunteer.module';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Volunteer,
  Game,
  Zone,
  Timeslot,
  GameZone,
  VolunteerAssignment,
} from './entities';
import { GameModule } from './game/game.module';
import { ZoneModule } from './zone/zone.module';
import { TimeslotModule } from './timeslot/timeslot.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.TOWER_DB_HOST || 'localhost',
      port: parseInt(process.env.TOWER_DB_PORT) || 5432,
      username: process.env.TOWER_DB_USERNAME || 'postgres',
      password: process.env.TOWER_DB_PASSWORD || 'postgres',
      database: process.env.TOWER_DB_DATABASE || 'postgres',
      models: [Volunteer, Game, Zone, Timeslot, GameZone, VolunteerAssignment],
      autoLoadModels: true,
      logging: process.env.NODE_ENV === 'PRODUCTION' ? false : Logger.debug,
      pool: {
        max: process.env.NODE_ENV === 'PRODUCTION' ? 50 : 2,
        min: process.env.NODE_ENV === 'PRODUCTION' ? 20 : 2,
        idle: 5000,
      },
    }),
    VolunteerModule,
    GameModule,
    ZoneModule,
    TimeslotModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

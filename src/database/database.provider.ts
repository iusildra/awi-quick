import { Sequelize } from 'sequelize-typescript';

import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { Logger } from '@nestjs/common';
import {
  Game,
  GameZone,
  Timeslot,
  Volunteer,
  VolunteerAssignment,
  Zone,
} from 'src/entities';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        Volunteer,
        Game,
        Zone,
        Timeslot,
        GameZone,
        VolunteerAssignment,
      ]);
      await sequelize.sync();
      Logger.debug('Database synced.');
      return sequelize;
    },
  },
];

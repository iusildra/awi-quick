import * as dotenv from 'dotenv';

import { IDatabaseConfig } from './dbConfig.interface';
import { Logger } from '@nestjs/common';

dotenv.config();

const defaultConfig = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  autoLoadsModels: true,
  logging: process.env.NODE_ENV === 'PRODUCTION' ? Logger.error : Logger.debug,
  pool: {
    max: process.env.NODE_ENV === 'PRODUCTION' ? 50 : 2,
    min: process.env.NODE_ENV === 'PRODUCTION' ? 20 : 2,
    idle: 5000,
  },
};

export const databaseConfig: IDatabaseConfig = {
  development: {
    ...defaultConfig,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME_DEVELOPMENT,
  },
  test: {
    ...defaultConfig,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME_TEST,
  },
  production: {
    ...defaultConfig,
    database: process.env.DB_NAME_PRODUCTION,
  },
};

import { PoolOptions, SyncOptions } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
export interface IDatabaseConfigAttributes {
  dialect?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  database?: string;
  models?: string[] | ModelCtor[];
  autoLoadModels?: boolean;
  logging?: boolean | ((sql: string, timing?: number) => void);
  pool?: PoolOptions;
  sync?: SyncOptions;
  urlDatabase?: string;
}

export interface IDatabaseConfig {
  development: IDatabaseConfigAttributes;
  test: IDatabaseConfigAttributes;
  production: IDatabaseConfigAttributes;
}

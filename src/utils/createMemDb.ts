import { ModelCtor, Sequelize } from 'sequelize-typescript';

export async function createMemDB(models: ModelCtor[]): Promise<Sequelize> {
  const memDb = new Sequelize({
    dialect: 'postgres',
    storage: ':memory:',
    username: 'test',
    password: 'test',
    database: 'test',
    logging: false,
    host: 'localhost',
    port: 5433,
  });
  memDb.addModels(models);

  await memDb.sync();

  return memDb;
}

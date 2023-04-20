import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConfigFromEnv } from '../dtos/configuration.dto';

/**
 * Get orm configuration details
 * @returns TypeOrmModuleOptions
 */
export const getOrmConfiguration = (): TypeOrmModuleOptions => {
  const configuration = getConfigFromEnv();
  return {
    type: 'postgres',
    host: configuration.postgresHost,
    port: configuration.postgresPort,
    username: configuration.postgresUsername,
    password: configuration.postgresPassword,
    database: configuration.postgresDatabaseName,
    // should be off in a production setting
    synchronize: true,
    entities: ['*.entity.ts'],
    migrationsTableName: 'migration',
    migrations: ['src/migration/*.ts'],
  };
};

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConfigFromEnv } from '../dtos/configuration.dto';
import { Room } from '../../chat/model/room.entity';
import { User } from '../../chat/model/user.entity';
import { Message } from '../../chat/model/message.entity';
import { Migration } from 'typeorm';
import { DatabaseSeed1682066463062 } from 'src/migrations/1682066463062-DatabaseSeed';
import { SchemaSetup1682066365257 } from 'src/migrations/1682066365257-SchemaSetup';

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
    synchronize: false,
    entities: [Room, User, Message],
    migrationsTableName: 'migration',
    logging: true,
    migrationsRun: true,
    migrations: [SchemaSetup1682066365257, DatabaseSeed1682066463062],
  };
};

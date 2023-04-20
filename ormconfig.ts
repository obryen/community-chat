import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

const ormConfigs: TypeOrmModuleOptions & { seeds: string[]; factories: string[] } =
{
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['src/**/*.entity{.ts,.js}', './dist/src/**/*.entity{.ts,.js}', '../dist/src/**/*.entity{.ts,.js}'],
    migrations: ['dist/src/database/migrations/*{.ts,.js}'],
    seeds: ['database/seeds/**/*{.ts,.js}'],
    factories: ['database/factories/**/*{.ts,.js}'],
    logging: true
};

module.exports = ormConfigs;
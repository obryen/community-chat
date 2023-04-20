export class Configuration {
  postgresHost: string;
  postgresPort: number;
  postgresDatabaseName: string;
  postgresUsername: string;
  postgresPassword: string;
  appPort: string;
}

export const getConfigFromEnv = (): Configuration => ({
  appPort: process.env.PORT,
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: parseInt(process.env.POSTGRES_PORT),
  postgresDatabaseName: process.env.POSTGRES_DATABASE_NAME,
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresPassword: process.env.POSTGRES_PASSWORD,
});

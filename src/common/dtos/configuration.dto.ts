export class Configuration {
  postgresHost: string;
  postgresPort: number;
  postgresDatabaseName: string;
  postgresUsername: string;
  postgresPassword: string;
}

export const getConfigFromEnv = (): Configuration => ({
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: parseInt(process.env.POSTGRES_PORT),
  postgresDatabaseName: process.env.POSTGRES_DATABASE_NAME,
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresPassword: process.env.POSTGRES_PASSWORD,
});

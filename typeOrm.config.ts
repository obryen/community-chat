
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/chat/model/user.entity';
import { Room } from './src/chat/model/room.entity';
import { Message } from './src/chat/model/message.entity';

config();

 
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE_NAME,
  entities: [
    User,
    Room,
    Message,
  ],
  migrations: []
})
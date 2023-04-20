import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { } from '../ormconfig'
import { getOrmConfiguration } from './common/configs/orm-config';
import { getConfigFromEnv } from './common/dtos/configuration.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      load: [getConfigFromEnv],
    }),
    TypeOrmModule.forRoot(getOrmConfiguration()),
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

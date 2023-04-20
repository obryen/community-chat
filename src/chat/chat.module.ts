import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './model/room.entity';
import { User } from './model/user.entity';
import { Message } from './model/message.entity';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Room, User])
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { }

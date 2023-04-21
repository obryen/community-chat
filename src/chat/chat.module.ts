import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './model/room.entity';
import { User } from './model/user.entity';
import { RoomMessage } from './model/message.entity';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RoomController } from './room.controller';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomMessage, Room, User])
  ],
  controllers: [RoomController, UserController],
  providers: [ChatService],
})
export class ChatModule { }

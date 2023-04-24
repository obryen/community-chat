import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { GetLastestMessagesResponseDto } from './dto/get-latest-messages-res.dto';
import { CreateRoomResponseDto } from './dto/create-room-res.dto';
import { AddUserToRoomResponseDto } from './dto/add-user-to-room-res.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly chatService: ChatService) { }

  @Post('')
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<CreateRoomResponseDto> {
    const room = await this.chatService.createRoom(createRoomDto.name);
    return { id: room.id };
  }

  @Post(':roomId/users/:userId')
  async addUserToRoom(@Param('roomId') roomId: string, @Param('userId') userId: string): Promise<AddUserToRoomResponseDto> {
    const room = await this.chatService.addUserToRoom(roomId, userId);
    return { users: room.users };
  }

  @Post(':roomId/messages')
  async sendMessageToRoom(@Param('roomId') roomId: string, @Body() sendMessageDto: SendMessageDto): Promise<{ id: string }> {
    const message = await this.chatService.sendMessageToRoom(roomId, sendMessageDto.userId, sendMessageDto.text);
    return { id: message.id };
  }

  @Get(':roomId/messages')
  async getLatestMessagesFromRoom(@Param('roomId') roomId: string, @Query('limit') limit = 10): Promise<GetLastestMessagesResponseDto[]> {
    const messages = await this.chatService.getLatestMessagesFromRoom(roomId, limit);
    return messages.map(m => ({
      id: m.id,
      text: m.text,
      user: { id: m.user.id, name: m.user.name },
      createdAt: m.createdAt,
    }));
  }
}

import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const room = await this.chatService.createRoom(createRoomDto.name);
    return { id: room.id };
  }

  @Post('rooms/:roomId/users/:userId')
  async addUserToRoom(@Param('roomId') roomId: string, @Param('userId') userId: string) {
    const room = await this.chatService.addUserToRoom(roomId, userId);
    return { users: room.users };
  }

  @Post('rooms/:roomId/messages')
  async sendMessageToRoom(@Param('roomId') roomId: string, @Body() sendMessageDto: SendMessageDto) {
    const message = await this.chatService.sendMessageToRoom(roomId, sendMessageDto.userId, sendMessageDto.text);
    return { id: message.id };
  }

  @Get('rooms/:roomId/messages')
  async getLatestMessagesFromRoom(@Param('roomId') roomId: string, @Query('limit') limit = 10) {
    const messages = await this.chatService.getLatestMessagesFromRoom(roomId, limit);
    return messages.map(m => ({
      id: m.id,
      text: m.text,
      user: { id: m.user.id, name: m.user.name },
      createdAt: m.createdAt,
    }));
  }
}

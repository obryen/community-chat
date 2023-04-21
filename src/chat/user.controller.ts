import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('user')
export class UserController {
  constructor(private readonly chatService: ChatService) { }

  @Get('')
  async getUser() {
    return await this.chatService.fetchUser();
  }
}

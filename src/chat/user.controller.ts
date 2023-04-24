import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from './model/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly chatService: ChatService) { }

  @Get('')
  async getUser(): Promise<User> {
    return await this.chatService.fetchUser();
  }
}

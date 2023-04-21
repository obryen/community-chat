import { ApiProperty } from '@nestjs/swagger';
import { User } from '../model/user.entity';


export class AddUserToRoomResponseDto {
  @ApiProperty({ description: 'a list of users added to the room' })
  users: User[];
}

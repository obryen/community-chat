import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class AddUserToRoomDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsNotEmpty()
  userId: string;
}

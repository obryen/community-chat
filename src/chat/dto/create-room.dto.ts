import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({description: "desired name of the room"})
  @IsNotEmpty()
  name: string;
}

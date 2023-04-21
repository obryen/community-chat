import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoomResponseDto {
  @ApiProperty({ description: 'Id of the created room' })
  id: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ description: 'message contained in this field' })
  @IsNotEmpty()
  text: string;
}

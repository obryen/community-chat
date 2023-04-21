import { ApiProperty } from '@nestjs/swagger';

export class SendMessageResponseDto {
  @ApiProperty({ description: 'Id of the created message' })
  id: string;
}

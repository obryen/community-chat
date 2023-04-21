import { ApiProperty } from '@nestjs/swagger';

export class GetLastestMessagesResponseDto {
  @ApiProperty({ example: '85d46160-0543-4c13-98a4-ebd9e0e488bd' })
  id: string;

  @ApiProperty({ example: 'Hello folks' })
  text: string;

  @ApiProperty({
    example: {
      id: 'e491877d-c577-456a-b822-424f0d084724',
      name: 'Peter Petrelli',
    },
  })
  user: {
    id: string;
    name: string;
  };

  @ApiProperty({ example: '2023-04-21T12:17:23.590Z' })
  createdAt: Date;
}

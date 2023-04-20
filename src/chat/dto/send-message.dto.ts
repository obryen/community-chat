import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  text: string;
}

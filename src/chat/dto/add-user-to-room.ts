import { IsNotEmpty } from 'class-validator';

export class AddUserToRoomDto {
  @IsNotEmpty()
  userId: string;
}

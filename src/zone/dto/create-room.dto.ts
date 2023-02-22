import { IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @Length(3, 255)
  name: string;
}

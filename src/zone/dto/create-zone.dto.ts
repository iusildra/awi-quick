import { IsString, Length } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  @Length(3, 255)
  name: string;
}

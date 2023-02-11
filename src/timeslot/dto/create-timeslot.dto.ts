import { IsDate, IsString } from 'class-validator';

export class CreateTimeslotDto {
  @IsDate()
  begin: Date;

  @IsDate()
  end: Date;

  @IsString()
  name: string;
}

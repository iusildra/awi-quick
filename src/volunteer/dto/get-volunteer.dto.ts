import { IsEmail, IsString, IsUUID, Length } from 'class-validator';

export class GetVolunteerDto {
  @IsUUID()
  id: string;

  @IsString()
  @Length(2, 255)
  username: string;

  @IsString()
  @Length(2, 255)
  firstName: string;

  @IsString()
  @Length(2, 255)
  lastName: string;

  @IsEmail()
  @Length(2, 255)
  email: string;
}

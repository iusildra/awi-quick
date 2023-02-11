import { IsString, Length } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(2, 255)
  username: string;

  @IsString()
  @Length(2, 255)
  firstName: string;

  @IsString()
  @Length(2, 255)
  lastName: string;

  @IsString()
  @Length(2, 255)
  email: string;

  @IsString()
  @Length(8, 255)
  password: string;
}

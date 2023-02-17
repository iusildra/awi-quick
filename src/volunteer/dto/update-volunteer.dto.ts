import { PartialType } from '@nestjs/mapped-types';
import { SignupDto } from './signup.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateVolunteerDto extends PartialType(SignupDto) {
  @ApiProperty({
    example: 'xXUserXx',
    description: 'The username of the volunteer',
    type: 'string',
    required: false,
  })
  username?: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the volunteer',
    type: 'string',
    required: false,
  })
  @IsString()
  @Length(2, 255)
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the volunteer',
    type: 'string',
    required: false,
  })
  @IsString()
  @Length(2, 255)
  lastName?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the volunteer',
    type: 'string',
    required: false,
  })
  @IsString()
  @Length(2, 255)
  email?: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the volunteer',
    type: 'string',
    required: false,
  })
  @IsString()
  @Length(8, 255)
  password?: string;
}

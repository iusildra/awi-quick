import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, Length } from 'class-validator';

export class GetVolunteerDto {
  @ApiProperty({
    example: 'b2b9c7c0-5c6a-4b6e-8c1b-8c7b8c7b8c7b',
    description: 'The id of the volunteer',
    type: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'xXUserXx',
    description: 'The username of the volunteer',
    type: 'string',
  })
  @IsString()
  @Length(2, 255)
  username: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the volunteer',
    type: 'string',
  })
  @IsString()
  @Length(2, 255)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the volunteer',
    type: 'string',
  })
  @IsString()
  @Length(2, 255)
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the volunteer',
    type: 'string',
  })
  @IsEmail()
  @Length(2, 255)
  email: string;
}

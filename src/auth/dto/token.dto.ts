import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsEmail } from 'class-validator';

export class TokenPayloadDto {
  @ApiProperty({ example: 'john', type: 'string' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john.doe@example.com', type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'b2b9c7c0-5c6a-4b6e-8c1b-8c7b8c7b8c7b',
    type: 'uuid',
  })
  @IsString()
  sub: string;

  @ApiProperty({
    example: 'true',
    type: 'boolean',
  })
  @IsBoolean()
  isAdmin: boolean;
}

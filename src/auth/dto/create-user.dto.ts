import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    nullable: false,
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Strong2025',
    description: 'The password of the user',
    nullable: false,
  })
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    nullable: false,
  })
  @IsString()
  fullName: string;
}

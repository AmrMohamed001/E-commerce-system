import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
	@IsEmail()
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@IsString()
	@ApiProperty({ description: 'The password of the user' })
	password: string;
}

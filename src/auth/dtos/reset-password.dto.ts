import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
	@IsEmail()
	email: string;
	@IsStrongPassword(
		{ minLength: 6 },
		{
			message:
				'Please enter a strong password containing lowercase, uppercase, numbers, and symbols',
		}
	)
	@ApiProperty({ description: 'The password after resetting of the user' })
	password: string;
	@IsString()
	confirmPassword: string;
}

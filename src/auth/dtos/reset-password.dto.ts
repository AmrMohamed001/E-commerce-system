import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class ResetPasswordDto {
	@IsEmail()
	@Field()
	email: string;

	@IsStrongPassword(
		{ minLength: 6 },
		{
			message:
				'Please enter a strong password containing lowercase, uppercase, numbers, and symbols',
		}
	)
	@Field()
	password: string;

	@IsString()
	@Field()
	confirmPassword: string;
}

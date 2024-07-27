import { Field, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsStrongPassword,
	Length,
} from 'class-validator';
@InputType()
export class CreateUserDto {
	@IsString()
	@Length(5, 12)
	@Field()
	username: string;

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

	@IsPhoneNumber('EG')
	@IsOptional()
	@Field({ nullable: true })
	phone: string;

	@IsOptional()
	@Field({ nullable: true })
	image?: string;
}

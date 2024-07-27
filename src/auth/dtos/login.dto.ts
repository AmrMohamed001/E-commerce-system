import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class LoginDto {
	@IsEmail()
	@Field()
	email: string;

	@IsString()
	@Field()
	password: string;
}

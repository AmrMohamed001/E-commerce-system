import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class VerifyEmailDto {
	@IsEmail()
	@Field()
	email: string;

	@IsString()
	@Length(6, 6)
	@Field()
	otp: string;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class UpdatePasswordDto {
	@IsString()
	@Field()
	password: string;

	@IsString()
	@IsStrongPassword()
	@Field()
	newPassword: string;

	@IsString()
	@Field()
	confirmNewPassword: string;
}

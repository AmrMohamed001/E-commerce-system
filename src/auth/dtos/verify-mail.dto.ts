import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
	@IsEmail()
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@IsString()
	@Length(6, 6)
	@ApiProperty({ description: 'The otp sent to the user' })
	otp: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsStrongPassword,
	Length,
} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@Length(5, 12)
	@ApiProperty({ description: 'The username of the user' })
	username: string;

	@IsEmail()
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@IsStrongPassword(
		{ minLength: 6 },
		{
			message:
				'Please enter a strong password containing lowercase, uppercase, numbers, and symbols',
		}
	)
	@ApiProperty({ description: 'The password of the user' })
	password: string;

	@IsString()
	@ApiProperty({ description: 'The confirm password of the user' })
	confirmPassword: string;

	@IsPhoneNumber('EG')
	@IsOptional()
	@ApiProperty({ description: 'The phone number of the user' })
	phone: string;

	@IsOptional()
	@ApiProperty({ description: 'The image of the user' })
	image?: string;
}

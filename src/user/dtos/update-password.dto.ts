import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
	@IsString()
	@ApiProperty({ description: 'The current password of the user' })
	password: string;

	@IsString()
	@IsStrongPassword()
	@ApiProperty({ description: 'The new password of the user' })
	newPassword: string;

	@IsString()
	@ApiProperty({ description: 'The confirm new password of the user' })
	confirmNewPassword: string;
}

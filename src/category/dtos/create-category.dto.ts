import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	@ApiProperty({ description: 'The name of the category' })
	readonly name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateSubcategoryDto {
	@IsString()
	@ApiProperty({ description: 'The name of the subcategory' })
	name: string;

	@IsInt()
	@ApiProperty({
		description: 'The ID of the category the subcategory belongs to',
	})
	categoryId: number;
}

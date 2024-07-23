import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsArray,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateProductDto {
	@ApiProperty({ description: 'The title of the product' })
	@IsString()
	title: string;

	@ApiProperty({ description: 'The description of the product' })
	@IsString()
	description: string;

	@ApiProperty({ description: 'The specifications of the product' })
	@IsString()
	specifications: string;

	@ApiProperty({ description: 'The price of the product' })
	@IsNumber()
	@Type(() => Number)
	price: number;

	@ApiProperty({ description: 'The quantity of the product' })
	@IsInt()
	@Type(() => Number)
	quantity: number;

	@ApiProperty({ description: 'The ID of the category the product belongs to' })
	@IsInt()
	@Type(() => Number)
	categoryId: number;

	@ApiPropertyOptional({
		description: 'The ID of the subcategory the product belongs to',
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	subcategoryId?: number;
}

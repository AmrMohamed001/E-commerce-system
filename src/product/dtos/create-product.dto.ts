import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
@InputType()
export class CreateProductDto {
	@Field()
	@IsString()
	title: string;

	@Field()
	@IsString()
	description: string;

	@Field()
	@IsString()
	specifications: string;

	@IsNumber()
	@Type(() => Number)
	@Field(() => Int)
	price: number;

	@IsInt()
	@Type(() => Number)
	@Field(() => Int)
	quantity: number;

	@IsInt()
	@Type(() => Number)
	@Field(() => Int)
	categoryId: number;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Field(() => Int, { nullable: true })
	subcategoryId?: number;

	imageCover?: string;

	images?: string[];
}

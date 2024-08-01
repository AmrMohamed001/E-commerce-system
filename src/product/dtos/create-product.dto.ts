import { Type } from 'class-transformer';
import {
	IsArray,
	IsInt,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class LocalizationInput {
	@Field()
	@IsString()
	title: string;

	@Field()
	@IsString()
	description: string;

	@Field()
	@IsString()
	specifications: string;
}

@InputType()
class ProductBodyInput {
	@IsString()
	@Field(() => String)
	language: string;

	@Field(() => LocalizationInput)
	@Type(() => LocalizationInput)
	@IsObject()
	localization: LocalizationInput;
}

@InputType()
export class CreateProductInput {
	@Field(() => [ProductBodyInput])
	@Type(() => ProductBodyInput)
	@IsArray()
	body: ProductBodyInput[];

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

	imageCover: string;
	images: string[];
}

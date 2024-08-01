// @InputType()
// export class UpdateProductDto extends PartialType(CreateProductInput) {}

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
class LocalizationInputUpdate {
	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	title: string;

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	description: string;

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	specifications: string;
}

@InputType()
class ProductBodyInputUpdate {
	@IsString()
	@Field(() => String, { nullable: true })
	@IsOptional()
	language: string;

	@Field(() => LocalizationInputUpdate, {
		nullable: true,
	})
	@Type(() => LocalizationInputUpdate)
	@IsObject()
	@IsOptional()
	localization: LocalizationInputUpdate;
}

@InputType()
export class UpdateProductInput {
	@Field(() => [ProductBodyInputUpdate], { nullable: true })
	@Type(() => ProductBodyInputUpdate)
	@IsArray()
	@IsOptional()
	body: ProductBodyInputUpdate[];

	@IsNumber()
	@Type(() => Number)
	@Field(() => Int, { nullable: true })
	@IsOptional()
	price: number;

	@IsInt()
	@Type(() => Number)
	@Field(() => Int, { nullable: true })
	@IsOptional()
	quantity: number;

	@IsInt()
	@Type(() => Number)
	@Field(() => Int, { nullable: true })
	@IsOptional()
	categoryId: number;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Field(() => Int, { nullable: true })
	subcategoryId?: number;

	imageCover: string;
	images: string[];
}

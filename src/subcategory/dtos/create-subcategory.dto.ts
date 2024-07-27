import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsInt } from 'class-validator';

@InputType()
export class CreateSubcategoryDto {
	@IsString()
	@Field()
	name: string;

	@IsInt()
	@Field(() => Int)
	categoryId: number;
}

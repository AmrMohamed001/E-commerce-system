import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class QueryDto {
	@Field(() => Int, { nullable: true })
	@IsNumber()
	@IsOptional()
	page?: number;

	@Field(() => Int, { nullable: true })
	@IsNumber()
	@IsOptional()
	limit?: number;

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	search?: string;
}

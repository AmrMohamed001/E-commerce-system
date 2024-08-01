import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateLanguageInput {
	@Field()
	@IsString()
	language: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsBoolean()
	isDefault: boolean;
}

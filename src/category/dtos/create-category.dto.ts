import { Field, InputType } from '@nestjs/graphql';

import { IsAlpha, IsString } from 'class-validator';
@InputType()
export class CreateCategoryDto {
	@IsAlpha()
	@Field()
	name: string;
}

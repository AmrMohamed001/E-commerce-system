import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/category/category.entity';
import { Subcategory } from 'src/subcategory/subcategory.entity';

@ObjectType()
export class LocalizedProduct {
	@Field(() => Int)
	id: number;

	@Field()
	price: string;

	@Field(() => Int)
	quantity: number;

	@Field()
	imageCover: string;

	@Field(() => [String])
	images: string[];

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Category, { nullable: true })
	category: Category;

	@Field(() => Subcategory, { nullable: true })
	subcategory: Subcategory;

	@Field()
	languageCode: string;

	@Field()
	title: string;

	@Field()
	specifications: string;

	@Field()
	description: string;

	@Field(() => Date)
	updatedAt: Date;
}

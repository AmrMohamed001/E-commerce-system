import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from '../product.entity';
import { LocalizedProduct } from './localized-product.type';

@ObjectType()
export class GetProducts {
	@Field(() => Int)
	total: number;

	@Field(() => Int)
	page: number;

	@Field(() => Int)
	limit: number;

	@Field(() => [LocalizedProduct])
	data: LocalizedProduct[];
}

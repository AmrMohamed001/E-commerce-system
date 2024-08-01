import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductCreated {
	@Field()
	message: string;
}

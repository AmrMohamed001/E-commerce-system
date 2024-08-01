import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateProductType {
	@Field()
	message: string;
}

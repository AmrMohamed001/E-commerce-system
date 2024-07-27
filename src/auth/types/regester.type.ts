import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegesterUser {
	@Field(() => Int)
	userId: number;

	@Field()
	email: string;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class SerializedUser {
	@Field(() => Int)
	id: number;

	@Field()
	username: string;

	@Field()
	email: string;

	@Field({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	image?: string;

	@Field({ nullable: true })
	createdAt?: Date;
}

import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class verifyEmailType {
	@Field()
	message: string;
}

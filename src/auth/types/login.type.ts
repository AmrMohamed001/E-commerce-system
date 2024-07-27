import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginType {
	@Field()
	access_token: string;
}

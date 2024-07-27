import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const currentUser = createParamDecorator(
	(data: never, context: ExecutionContext) => {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;
		return req.user;
	}
);

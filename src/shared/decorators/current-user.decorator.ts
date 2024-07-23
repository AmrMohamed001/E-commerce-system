import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentUser = createParamDecorator(
	(data: never, context: ExecutionContext) => {
		const req = context.switchToHttp().getRequest();

		return req.user;
	}
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Lang = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		return ctx.getArgs()[2].req.i18nLang;
	}
);

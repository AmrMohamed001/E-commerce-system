import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private i18n: I18nService
	) {}

	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;
		const currentUserRole = req.user?.role;
		const lang = context.getArgs()[2].req.i18nLang;

		if (!currentUserRole)
			throw new ForbiddenException(
				this.i18n.t('exceptions.ROLE_NOT_FOUND', {
					lang,
				})
			);

		const allowedRole = this.reflector.get<string>(
			'role',
			context.getHandler()
		);

		if (!allowedRole) return true;

		if (currentUserRole === 'admin') return true;

		if (allowedRole !== currentUserRole) {
			throw new ForbiddenException(
				this.i18n.t('exceptions.NOT_PERMITTED', {
					lang,
				})
			);
		}

		return true;
	}
}

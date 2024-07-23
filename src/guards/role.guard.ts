import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const currentUserRole = req.user?.role;

		if (!currentUserRole) throw new ForbiddenException('User role not found');

		const allowedRole = this.reflector.get<string>(
			'role',
			context.getHandler()
		);

		if (!allowedRole) return true;

		if (currentUserRole === 'admin') return true;

		if (allowedRole !== currentUserRole) {
			throw new ForbiddenException(
				'You do not have permission to access this resource'
			);
		}

		return true;
	}
}

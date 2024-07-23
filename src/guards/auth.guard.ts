import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private userService: UserService
	) {}
	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(req);
		if (!token)
			throw new UnauthorizedException('token is not valid , try again');

		try {
			const payload = await this.jwtService.verify(token, {
				secret: this.configService.get<string>('JWT_SECRET'),
			});
			const user = await this.userService.findById(payload.id);
			if (!user) throw new NotFoundException('this user is not exist');

			if (this.checkJwtIat(user, payload.iat))
				throw new UnauthorizedException(
					'user changed password after token was issued'
				);

			const currentUser = {
				id: payload.id,
				email: payload.email,
				role: payload.role,
			};
			req['user'] = currentUser;
			return true;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException('JWT token has expired');
			}
			throw new UnauthorizedException('Invalid token');
		}
	}
	private extractTokenFromHeader(request: Request) {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	private checkJwtIat(user, iat: number) {
		if (user.changePasswordAt) {
			const passwordTimeStamp = user.changePasswordAt / 1000;
			return passwordTimeStamp > iat;
		}
		return false;
	}
}

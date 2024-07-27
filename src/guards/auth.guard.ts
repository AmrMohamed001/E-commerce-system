import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private userService: UserService,
		private i18n: I18nService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;
		const token = this.extractTokenFromHeader(req);
		const lang = context.getArgs()[2].req.i18nLang;

		if (!token) {
			throw new UnauthorizedException(
				this.i18n.t('exceptions.NOT_VALID_TOKEN', {
					lang,
				})
			);
		}

		try {
			const payload = await this.jwtService.verify(token, {
				secret: this.configService.get<string>('JWT_SECRET'),
			});
			const user = await this.userService.findById(payload.id);
			if (!user)
				throw new NotFoundException(
					this.i18n.t('exceptions.NOT_FOUND_USER', {
						lang,
					})
				);

			if (this.checkJwtIat(user, payload.iat)) {
				throw new UnauthorizedException(
					this.i18n.t('exceptions.PASSWORD_AFTER_JWT', {
						lang,
					})
				);
			}

			const currentUser = {
				id: payload.id,
				email: payload.email,
				role: payload.role,
			};
			req['user'] = currentUser;
			return true;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException(
					this.i18n.t('exceptions.JWT_EXPIRED', {
						lang,
					})
				);
			}
			throw new UnauthorizedException(
				this.i18n.t('exceptions.NOT_VALID_TOKEN', {
					lang,
				})
			);
		}
	}

	private extractTokenFromHeader(request: any) {
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

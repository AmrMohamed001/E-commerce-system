import {
	HttpException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { UpdatePasswordDto } from 'src/user/dtos/update-password.dto';
import { User } from 'src/user/user.entity';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private mailService: MailService,
		private i18n: I18nService
	) {}

	private generateOtp() {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const hashedOtp = createHash('sha256').update(otp).digest('hex');
		return { hashedOtp, otp };
	}
	async register(body: CreateUserDto, lang?: string) {
		const { hashedOtp, otp } = this.generateOtp();
		const user = await this.userService.createUser(body, hashedOtp);
		try {
			this.sendVerificationEmail(body.email, otp);
		} catch (err) {
			this.userService.deleteUser(user.id);
			throw new InternalServerErrorException(
				this.i18n.t('exceptions.INTERNAL_SERVER_ERROR', {
					lang,
				})
			);
		}
		return { userId: user.id, email: user.email };
	}
	async verifyEmail(email: string, otp: string, lang?: string) {
		const user = await this.userService.findByEmail(email);
		const hashedOtp = createHash('sha256').update(otp).digest('hex');

		if (user && user.otp === hashedOtp && user.otpExpiration > Date.now()) {
			user.isVerified = true;
			user.otp = null;
			user.otpExpiration = null;
			await this.userService.updateUser(user.id, user, undefined, {
				listeners: false,
			});

			return { message: 'Email verified successfully' };
		}

		return { message: 'Invalid OTP Or Mail' };
	}

	private async validateUser(email: string, pass: string) {
		const user = await this.userService.findByEmail(email);

		if (
			!user ||
			user.isVerified === false ||
			!(await bcrypt.compare(pass, user.password))
		)
			return null;
		const { password, ...result } = user;
		return result;
	}

	signToken(user: Partial<User>) {
		const payload = { id: user.id, role: user.role };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async login(email: string, password: string, lang?: string) {
		const result = await this.validateUser(email, password);
		if (!result)
			throw new HttpException(
				this.i18n.t('exceptions.CREDENTIAL_ERROR', {
					lang,
				}),
				401
			);
		return this.signToken(result);
	}

	sendVerificationEmail(email: string, otp: string) {
		this.mailService.sendVerificationEmail(
			email,
			'Email Verification',
			`Your OTP for email verification is ${otp}`
		);
	}

	async updatePassword(id: number, body: UpdatePasswordDto, lang?: string) {
		const user = await this.userService.updateUserPassword(id, body);
		return this.signToken(user);
	}

	async forgetPassword(email: string, lang?: string) {
		const user = await this.userService.findByEmail(email);
		if (!user)
			throw new NotFoundException(
				this.i18n.t('exceptions.NOT_FOUND_USER', {
					lang,
				})
			);
		const { hashedOtp, otp } = this.generateOtp();
		user.otp = hashedOtp;
		user.otpExpiration = Date.now() + 10 * 60 * 1000;
		user.isVerified = false;
		await this.userService.updateUser(user.id, user, undefined, {
			listeners: false,
		});
		try {
			this.sendVerificationEmail(email, otp);
		} catch (err) {
			user.otp = null;
			user.otpExpiration = null;
			user.isVerified = false;
			await this.userService.updateUser(user.id, user, undefined, {
				listeners: false,
			});
			throw new InternalServerErrorException(
				this.i18n.t('exceptions.INTERNAL_SERVER_ERROR', {
					lang,
				})
			);
		}
		return { userId: user.id, email: user.email };
	}

	async resetPassword(body: ResetPasswordDto, lang?: string) {
		const { email, password, confirmPassword } = body;
		const user = await this.userService.findByEmail(email);
		if (!user)
			throw new NotFoundException(
				this.i18n.t('exceptions.USER_BY_EMAIL', {
					lang,
				})
			);

		if (!user.isVerified)
			throw new HttpException(
				this.i18n.t('exceptions.REQUIRE_EMAIL_VERIFICATION', {
					lang,
				}),
				403
			);

		user.password = password;
		user.confirmPassword = confirmPassword;
		user.changePasswordAt = Date.now();
		await this.userService.updateUser(user.id, user);
		return this.signToken(user);
	}
}

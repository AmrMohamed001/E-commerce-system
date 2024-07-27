import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { RegesterUser } from './types/regester.type';
import { VerifyEmailDto } from './dtos/verify-mail.dto';
import { verifyEmailType } from './types/verify-email.type';
import { LoginDto } from './dtos/login.dto';
import { LoginType } from './types/login.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { currentUser } from 'src/shared/decorators/current-user.decorator';
import { UpdatePasswordDto } from 'src/user/dtos/update-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Lang } from 'src/shared/decorators/lang.decorator';

@Resolver(() => User)
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => RegesterUser)
	async register(@Args('input') input: CreateUserDto, @Lang() lang: string) {
		return this.authService.register(input, lang);
	}

	@Mutation(() => verifyEmailType)
	async verifyEmail(
		@Args('input') input: VerifyEmailDto,
		@Lang() lang: string
	) {
		return this.authService.verifyEmail(input.email, input.otp, lang);
	}

	@Mutation(() => LoginType)
	async login(@Args('input') input: LoginDto, @Lang() lang: string) {
		return this.authService.login(input.email, input.password, lang);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => LoginType)
	updatePassword(
		@currentUser() user: Partial<User>,
		@Args('input', { type: () => UpdatePasswordDto })
		body: UpdatePasswordDto,
		@Lang() lang: string
	) {
		return this.authService.updatePassword(user.id, body, lang);
	}

	@Mutation(() => RegesterUser)
	forgetPassword(@Args('email') email: string, @Lang() lang: string) {
		return this.authService.forgetPassword(email, lang);
	}

	@Mutation(() => LoginType)
	resetPassword(
		@Args('input', { type: () => ResetPasswordDto }) body: ResetPasswordDto,
		@Lang() lang: string
	) {
		return this.authService.resetPassword(body, lang);
	}
}

import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { VerifyEmailDto } from './dtos/verify-mail.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { currentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { UpdatePasswordDto } from 'src/user/dtos/update-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	async register(@Body() body: CreateUserDto) {
		return this.authService.register(body);
	}

	@Post('verify-email')
	async verifyEmail(@Body() body: VerifyEmailDto) {
		return this.authService.verifyEmail(body.email, body.otp);
	}

	@Post('login')
	async login(@Body() body: LoginDto) {
		return this.authService.login(body.email, body.password);
	}

	@UseGuards(AuthGuard)
	@Patch('update-password')
	updatePassword(
		@currentUser() user: Partial<User>,
		@Body() body: UpdatePasswordDto
	) {
		return this.authService.updatePassword(user.id, body);
	}

	@Post('forget-password')
	forgetPassword(@Body('email') email: string) {
		return this.authService.forgetPassword(email);
	}

	@Post('reset-password')
	resetPassword(@Body() body: ResetPasswordDto) {
		return this.authService.resetPassword(body);
	}
}

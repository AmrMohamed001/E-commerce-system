import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import * as bcrypt from 'bcrypt';
import { Options } from 'src/shared/interfaces/run-listeners-option.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		private readonly i18n: I18nService
	) {}

	createUser(body: CreateUserDto, otp: string) {
		const user = this.userRepo.create(body);
		user.otp = otp;
		return this.userRepo.save(user);
	}

	findAll() {
		return this.userRepo.find();
	}
	findByEmail(email: string) {
		return this.userRepo.findOne({ where: { email } });
	}

	async findById(id: number, lang?: string) {
		const user = this.userRepo.findOne({ where: { id } });
		if (!user)
			throw new NotFoundException(this.i18n.t('exceptions.NOT_FOUND_USER',{lang}));
		return user
	}

	getProfile(userId: number) {
		return this.findById(userId);
	}
	async updateUserPassword(id: number, body: UpdatePasswordDto, lang?: string) {
		const { password, newPassword, confirmNewPassword } = body;
		const user = await this.findById(id);

		if (!user)
			throw new NotFoundException(
				this.i18n.t('exceptions.NOT_FOUND_USER', { lang })
			);

		if (!(await bcrypt.compare(password, user.password)))
			throw new BadRequestException(
				this.i18n.t('exceptions.CURRENT_PASS_IS_IN_CORRECT', { lang })
			);

		user.password = newPassword;
		user.confirmPassword = confirmNewPassword;
		user.changePasswordAt = Date.now();
		return this.userRepo.save(user);
	}

	async updateUser(
		id: number,
		body: UpdateUserDto,
		lang?: string,
		opt?: Options,
		
	) {
		const user = await this.findById(id);
		if (!user)
			throw new NotFoundException(
				this.i18n.t('exceptions.NOT_FOUND_USER', { lang })
			);
		Object.assign(user, body);
		return this.userRepo.save(user, opt);
	}

	async updateRole(id: number, role: string, lang?: string) {
		const user = await this.findById(id);
		if (!user)
			throw new NotFoundException(
				this.i18n.t('exceptions.NOT_FOUND_USER', { lang })
			);
		user.role = role;
		return this.userRepo.save(user, { listeners: false });
	}

	async deleteUser(id: number, lang?: string) {
		const user = await this.findById(id);
		if (!user)
			throw new NotFoundException(
				this.i18n.t('exceptions.NOT_FOUND_USER', { lang })
			);
		return this.userRepo.remove(user);
	}
}

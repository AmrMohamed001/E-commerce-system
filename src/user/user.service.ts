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

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	createUser(body: CreateUserDto, otp: string) {
		const user = this.userRepo.create(body);
		user.otp = otp;
		return this.userRepo.save(user);
	}

	findByEmail(email: string) {
		return this.userRepo.findOne({ where: { email } });
	}

	async findById(id: number) {
		return this.userRepo.findOne({ where: { id } });
	}

	getProfile(userId: number) {
		return this.findById(userId);
	}
	async updateUserPassword(id: number, body: UpdatePasswordDto) {
		const { password, newPassword, confirmNewPassword } = body;
		const user = await this.findById(id);

		if (!user) throw new NotFoundException('User not found');

		if (!(await bcrypt.compare(password, user.password)))
			throw new BadRequestException('Current password is incorrect');

		user.password = newPassword;
		user.confirmPassword = confirmNewPassword;
		user.changePasswordAt = Date.now();
		return this.userRepo.save(user);
	}

	async updateUser(id: number, body: UpdateUserDto, opt?: Options) {
		const user = await this.findById(id);
		if (!user) throw new NotFoundException('User not found');
		Object.assign(user, body);
		return this.userRepo.save(user, opt);
	}

	async updateRole(id: number, role: string) {
		const user = await this.findById(id);
		if (!user) throw new NotFoundException('User not found');
		user.role = role;
		return this.userRepo.save(user, { listeners: false });
	}

	async deleteUser(id: number) {
		const user = await this.findById(id);
		if (!user) throw new NotFoundException('this user is not found');
		return this.userRepo.remove(user);
	}
}

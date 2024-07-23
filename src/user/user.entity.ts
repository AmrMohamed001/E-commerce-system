import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
@Entity()
@Index(['email'], { unique: true })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	confirmPassword: string;

	@Column('bigint', { nullable: true })
	changePasswordAt: number;

	@Column({ default: 'uploads/users/default.jpg' })
	image: string;

	@Column({ default: 'user' })
	role: string;

	@Column({ default: false })
	isVerified: boolean;

	@Column({ nullable: true })
	otp: string;

	@Column('bigint', {
		default: Date.now() + 10 * 60 * 1000,
		nullable: true,
	})
	otpExpiration: number;

	@Column({ nullable: true })
	phone: string;

	@CreateDateColumn()
	createdAt: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async validatePasswords() {
		if (this.password !== this.confirmPassword) {
			throw new BadRequestException('Passwords do not match confirmation');
		}
	}

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (!this.password) {
			throw new BadRequestException('Password is required');
		}
		this.password = await hash(this.password, 12);
		this.confirmPassword = undefined;
	}
}

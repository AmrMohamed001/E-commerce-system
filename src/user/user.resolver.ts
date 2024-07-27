import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from './user.entity';
import { FileUpload } from 'graphql-upload-ts';
import { GraphQLUpload } from 'graphql-upload-ts/dist/GraphQLUpload';
import { UserService } from './user.service';
import { UploadService } from 'src/upload/upload.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { currentUser } from 'src/shared/decorators/current-user.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from 'src/shared/decorators/role.decorator';
import { SerializedUser } from './types/serialized-user.type';
import { I18nService } from 'nestjs-i18n';
import { Lang } from 'src/shared/decorators/lang.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Resolver(() => SerializedUser)
export class UserResolver {
	constructor(
		private usersService: UserService,
		private uploadService: UploadService,
		private readonly i18n: I18nService
	) {}

	@Mutation(() => SerializedUser)
	async photoUpload(
		@Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
		@currentUser() user: Partial<User>
	) {
		const filename = await this.uploadService.uploadPhoto(file, 'users');
		return this.usersService.updateUser(
			user.id,
			{ image: `/uploads/users/${filename}` },
			undefined,
			{
				listeners: false,
			}
		);
	}

	@Query(() => SerializedUser)
	async me(@currentUser() user: Partial<User>) {
		return this.usersService.getProfile(user.id);
	}

	@Mutation(() => SerializedUser)
	async updateMe(
		@Args('input') input: UpdateUserDto,
		@currentUser() user: Partial<User>,
		@Lang() lang: string
	) {
		return this.usersService.updateUser(user.id, input, lang, {
			listeners: false,
		});
	}

	@Role('admin')
	@Query(() => SerializedUser)
	async user(@Args('id') id: number, @Lang() lang: string) {
		return this.usersService.findById(id, lang);
	}

	@Role('admin')
	@Query(() => [SerializedUser])
	async users() {
		return this.usersService.findAll();
	}

	@Role('admin')
	@Mutation(() => SerializedUser)
	updateUser(
		@Args('id') id: number,
		@Args('input') updateData: UpdateUserDto,
		@Lang() lang: string
	) {
		return this.usersService.updateUser(id, updateData, lang, {
			listeners: false,
		});
	}

	@Role('admin')
	@Mutation(() => SerializedUser)
	async updateRole(
		@Args('id') id: number,
		@Args('role') role: string,
		@Lang() lang: string
	) {
		return this.usersService.updateRole(id, role, lang);
	}

	@Role('admin')
	@Mutation(() => SerializedUser)
	async deleteUser(@Args('id') id: number, @Lang() lang: string) {
		return this.usersService.deleteUser(id, lang);
	}
}

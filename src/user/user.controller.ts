import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { currentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from './user.entity';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { UserSerializerDto } from './dtos/serialize.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard, RoleGuard)
@Serialize(UserSerializerDto)
@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private usersService: UserService) {}
	@Get('/profile')
	getProfile(@currentUser() user: Partial<User>) {
		return this.usersService.getProfile(user.id);
	}

	@Patch('/update-me')
	updateMe(@currentUser() user: Partial<User>, @Body() body: UpdateUserDto) {
		return this.usersService.updateUser(user.id, body, {
			listeners: false,
		});
	}

	@Post('upload-photo')
	@UseInterceptors(FileInterceptor('image'))
	uploadFile(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		return this.usersService.updateUser(
			//@ts-ignore
			req.user.id,
			{ image: `/uploads/users/${file.filename}` },
			{
				listeners: false,
			}
		);
	}

	@Role('admin')
	@Get('/:id')
	async getUser(@Param('id') id: string) {
		const user = await this.usersService.findById(parseInt(id));
		if (!user) throw new NotFoundException('this user is not found');
		return user;
	}
	@Role('admin')
	@Patch('/:id')
	async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
		return this.usersService.updateUser(parseInt(id), updateData, {
			listeners: false,
		});
	}
	@Role('admin')
	@Patch('/:id/role')
	async updateRole(@Param('id') id: string, @Body('role') role: string) {
		return this.usersService.updateRole(parseInt(id), role);
	}
}

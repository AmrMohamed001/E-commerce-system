import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UploadModule } from 'src/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		UploadModule,
		MulterModule.registerAsync({
			imports: [UploadModule],
			inject: [UploadService],
			useFactory: (uploadService: UploadService) => {
				return uploadService.getMulterOptions('users');
			},
		}),
	],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}

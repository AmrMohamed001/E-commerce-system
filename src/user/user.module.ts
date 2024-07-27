import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UploadModule } from 'src/upload/upload.module';
import { UserResolver } from './user.resolver';
@Module({
	imports: [TypeOrmModule.forFeature([User]), UploadModule],
	providers: [UserService, UserResolver],
	exports: [UserService],
})
export class UserModule {}

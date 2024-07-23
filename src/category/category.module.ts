import { Module } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CategoriesController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Category]), UserModule],
	providers: [CategoriesService],
	controllers: [CategoriesController],
	exports: [CategoriesService],
})
export class CategoryModule {}

import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { SubcategoriesService } from './subcategory.service';
import { SubcategoriesController } from './subcategory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './subcategory.entity';
import { UserModule } from 'src/user/user.module';

@Module({
	providers: [SubcategoriesService],
	controllers: [SubcategoriesController],
	imports: [
		TypeOrmModule.forFeature([Subcategory]),
		CategoryModule,
		UserModule,
	],
	exports: [SubcategoriesService],
})
export class SubcategoryModule {}

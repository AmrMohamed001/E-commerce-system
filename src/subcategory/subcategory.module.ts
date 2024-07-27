import { Module, forwardRef } from '@nestjs/common';
import { CategoryModule } from 'src/category/category.module';
import { SubcategoriesService } from './subcategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './subcategory.entity';
import { UserModule } from 'src/user/user.module';
import { SubCategoryResolver } from './subcategory.resolver';
import { DataloaderModule } from 'src/dataloader/dataloader.module';

@Module({
	providers: [SubcategoriesService, SubCategoryResolver],
	imports: [
		TypeOrmModule.forFeature([Subcategory]),
		forwardRef(() => CategoryModule),
		UserModule,
		forwardRef(() => DataloaderModule),
	],
	exports: [SubcategoriesService],
})
export class SubcategoryModule {}

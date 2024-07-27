import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryResolver } from './category.resolver';

import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { DataloaderModule } from 'src/dataloader/dataloader.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Category]),
		forwardRef(() => ProductModule),
		UserModule,
		DataloaderModule,
	],
	providers: [CategoriesService, CategoryResolver],
	exports: [CategoriesService],
})
export class CategoryModule {}

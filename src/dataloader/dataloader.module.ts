import { forwardRef, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { CategoryModule } from 'src/category/category.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { ProductModule } from 'src/product/product.module';

@Module({
	providers: [DataloaderService],
	imports: [
		forwardRef(() => CategoryModule),
		SubcategoryModule,
		forwardRef(() => ProductModule),
	],
	exports: [DataloaderService],
})
export class DataloaderModule {}

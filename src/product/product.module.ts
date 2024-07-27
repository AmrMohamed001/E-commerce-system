import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { UploadModule } from 'src/upload/upload.module';
import { UserModule } from 'src/user/user.module';
import { QueryService } from './query.service';
import { CategoryModule } from 'src/category/category.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { ProductResolver } from './product.resolver';
import { ProductLocalization } from './ProductLocalization.entity';
import { TranslateModule } from 'src/translate/translate.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Product, ProductLocalization]),
		UploadModule,
		UserModule,
		CategoryModule,
		SubcategoryModule,
		TranslateModule,
	],
	providers: [ProductService, QueryService, ProductResolver],
	exports: [ProductService],
})
export class ProductModule {}

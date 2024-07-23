import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { UploadModule } from 'src/upload/upload.module';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { QueryService } from './query.service';
import { CategoryModule } from 'src/category/category.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Product]),
		UploadModule,
		MulterModule.registerAsync({
			imports: [UploadModule],
			inject: [UploadService],
			useFactory: (uploadService: UploadService) => {
				return uploadService.getMulterOptions('products');
			},
		}),
		UserModule,
		CategoryModule,
		SubcategoryModule,
	],
	controllers: [ProductController],
	providers: [ProductService, QueryService],
})
export class ProductModule {}

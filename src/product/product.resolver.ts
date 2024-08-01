import {
	Resolver,
	Query,
	Args,
	Mutation,
	Parent,
	ResolveField,
} from '@nestjs/graphql';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { CreateProductInput } from './dtos/create-product.dto';
import { FileUpload } from 'graphql-upload-ts';
import { GraphQLUpload } from 'graphql-upload-ts/dist/GraphQLUpload';
import { UploadService } from 'src/upload/upload.service';
import { UpdateProductInput } from './dtos/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { GetProducts } from './types/get-products.type';
import { EntityWithId } from 'src/shared/dtos/entity-with-id.dto';
import { QueryDto } from './dtos/query.dto';
import { LocalizedProduct } from './types/localized-product.type';
import { Lang } from 'src/shared/decorators/lang.decorator';
import { ProductCreated } from './types/create-product.type';
import { Category } from 'src/category/category.entity';
import { DataloaderService } from 'src/dataloader/dataloader.service';

@Resolver(() => Product)
export class ProductResolver {
	constructor(
		private productService: ProductService,
		private uploadService: UploadService,
		private dataLoader: DataloaderService
	) {}

	@Query(() => [LocalizedProduct])
	async getProducts(@Lang() lang: string) {
		return this.productService.findAll(lang);
	}

	@Query(() => LocalizedProduct)
	async product(@Args('id') id: number, @Lang() lang: string) {
		const product = await this.productService.findOne(id, lang);
		if (!product)
			throw new NotFoundException(`product with this id ${id} is not found`);
		return product;
	}
	@ResolveField('category', () => [Category])
	async category(@Parent() products: LocalizedProduct) {
		if (!products.category) {
			return [];
		}
		return this.dataLoader.getCategoryByProductId.load(products.category.id);
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => ProductCreated)
	async createProduct(
		@Args('input') input: CreateProductInput,
		@Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
		@Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
		files: FileUpload[],
		@Lang() lang: string
	) {
		//uploading
		const coverImageUrl = await this.uploadService.uploadPhoto(
			file,
			'product-cover'
		);
		const imageUrls = await this.uploadService.uploadImages(files);

		//body
		const productData = {
			...input,
			imageCover: `/uploads/product-cover/${coverImageUrl}`,
			images: imageUrls.map((url) => `/uploads/products/${url}`),
		};
		return this.productService.create(productData, lang);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => ProductCreated)
	async updateProduct(
		@Args('id') id: number,
		@Args('input') input: UpdateProductInput,
		@Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
		@Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
		files: FileUpload[],
		@Lang() lang: string
	) {
		const BodyUpdate: any = {};
		//uploading
		if (file) {
			const coverImageUrl = await this.uploadService.uploadPhoto(
				file,
				'product-cover'
			);
			BodyUpdate.imageCover = `/uploads/product-cover/${coverImageUrl}`;
		}
		if (files) {
			const imageUrls = await this.uploadService.uploadImages(files);
			BodyUpdate.images = [
				...imageUrls.map((url) => `/uploads/products/${url}`),
			];
		}
		const content = {
			...input,
			...BodyUpdate,
		};
		return this.productService.findOneAndUpdate(id, content, lang);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => EntityWithId)
	async deleteProduct(@Args('id') id: number, @Lang() lang: string) {
		await this.productService.findOneAndDelete(id, lang);
		return new EntityWithId(id);
	}
}

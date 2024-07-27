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
import { CreateProductDto } from './dtos/create-product.dto';
import { FileUpload } from 'graphql-upload-ts';
import { GraphQLUpload } from 'graphql-upload-ts/dist/GraphQLUpload';
import { UploadService } from 'src/upload/upload.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { GetProducts } from './types/get-products.type';
import { EntityWithId } from 'src/shared/dtos/entity-with-id.dto';
import { QueryDto } from './dtos/query.dto';
import { LocalizedProduct } from './types/localized-product.type';
import { Lang } from 'src/shared/decorators/lang.decorator';

@Resolver(() => Product)
export class ProductResolver {
	constructor(
		private productService: ProductService,
		private uploadService: UploadService
	) {}

	@Query(() => GetProducts)
	async getProducts(
		@Args('query', { nullable: true }) queryOpt: QueryDto,
		@Lang() lang: string
	) {
		return this.productService.findAll(lang, queryOpt);
	}

	@Query(() => LocalizedProduct)
	async product(@Args('id') id: number, @Lang() lang: string) {
		const product = await this.productService.findOne(id, lang);
		if (!product)
			throw new NotFoundException(`product with this id ${id} is not found`);
		return product;
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => Product)
	async createProduct(
		@Args('body') body: CreateProductDto,
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
			...body,
			imageCover: `/uploads/product-cover/${coverImageUrl}`,
			images: imageUrls.map((url) => `/uploads/products/${url}`),
		};
		return this.productService.create(productData, lang);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => Product)
	async updateProduct(
		@Args('id') id: number,
		@Args('body') body: UpdateProductDto,
		@Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
		@Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
		files: FileUpload[],
		@Lang() lang: string
	) {
		//uploading
		if (file) {
			const coverImageUrl = await this.uploadService.uploadPhoto(
				file,
				'product-cover'
			);
			body.imageCover = `/uploads/product-cover/${coverImageUrl}`;
		}
		if (files) {
			const imageUrls = await this.uploadService.uploadImages(files);
			body.images = [
				...body.images,
				...imageUrls.map((url) => `/uploads/products/${url}`),
			];
		}
		return this.productService.findOneAndUpdate(id, body, lang);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => EntityWithId)
	async deleteProduct(@Args('id') id: number, @Lang() lang: string) {
		await this.productService.findOneAndDelete(id, lang);
		return new EntityWithId(id);
	}
}

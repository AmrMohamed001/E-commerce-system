import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsDto } from './dtos/get-products.dto';
import { QueryService } from './query.service';
import { CategoriesService } from 'src/category/category.service';
import { SubcategoriesService } from 'src/subcategory/subcategory.service';
import { Subcategory } from 'src/subcategory/subcategory.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product) private productRepo: Repository<Product>,
		private queryService: QueryService,
		private categoryService: CategoriesService,
		private subCategoryService: SubcategoriesService
	) {}

	async findAll(query: GetProductsDto) {
		const { search, sort, page = 1, limit = 10 } = query;
		let queryBuilder = this.productRepo.createQueryBuilder('product');

		queryBuilder = this.queryService.applySearch(queryBuilder, search);
		queryBuilder = this.queryService.applySort(queryBuilder, sort);
		queryBuilder = this.queryService.applyPagination(queryBuilder, page, limit);
		const total = await queryBuilder.getCount();
		const data = await queryBuilder.getMany();

		return {
			total,
			page,
			limit,
			data,
		};
	}
	findOne(id: number) {
		return this.productRepo.findOne({
			where: { id },
			relations: ['category', 'subcategory'],
		});
	}
	async create(body: CreateProductDto) {
		const category = await this.categoryService.findOne(body.categoryId);
		if (!category) {
			throw new NotFoundException(
				`Category with ID ${body.categoryId} not found`
			);
		}

		let subcategory: Subcategory | null = null;
		if (body.subcategoryId) {
			subcategory = await this.subCategoryService.findOne(body.subcategoryId);
			if (!subcategory) {
				throw new NotFoundException(
					`Subcategory with ID ${body.subcategoryId} not found`
				);
			}
		}

		const product = this.productRepo.create({
			...body,
			category,
			subcategory,
		});

		return this.productRepo.save(product);
	}
	async findOneAndUpdate(id: number, body: UpdateProductDto) {
		let newBody: any = { ...body };
		const product = await this.findOne(id);
		if (!product) throw new NotFoundException('product not found');

		if (body.categoryId) {
			const category = await this.categoryService.findOne(body.categoryId);
			if (!category) {
				throw new NotFoundException(
					`Category with ID ${body.categoryId} not found`
				);
			}
			newBody.categoryId = undefined;
			newBody.category = category;
		}

		if (body.subcategoryId) {
			const subCategory = await this.subCategoryService.findOne(
				body.subcategoryId
			);
			if (!subCategory) {
				throw new NotFoundException(
					`SubCategory with ID ${body.subcategoryId} not found`
				);
			}
			newBody.subCategory = undefined;
			newBody.subcategory = subCategory;
		}

		Object.assign(product, newBody);
		return this.productRepo.save(product);
	}

	async findOneAndDelete(id: number) {
		const product = await this.findOne(id);
		if (!product) throw new NotFoundException('product not found');

		return this.productRepo.remove(product);
	}
}

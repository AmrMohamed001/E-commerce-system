import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { In, Repository, Like } from 'typeorm';
import { CreateProductInput } from './dtos/create-product.dto';
import { UpdateProductInput } from './dtos/update-product.dto';
import { QueryService } from './query.service';
import { CategoriesService } from 'src/category/category.service';
import { SubcategoriesService } from 'src/subcategory/subcategory.service';
import { Subcategory } from 'src/subcategory/subcategory.entity';

import { ProductLocalization } from './ProductLocalization.entity';
import { TranslationService } from 'src/translate/translate.service';
import { I18nService, logger } from 'nestjs-i18n';
import { LanguagesService } from 'src/languages/languages.service';
import { QueryDto } from './dtos/query.dto';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product) private productRepo: Repository<Product>,
		@InjectRepository(ProductLocalization)
		private readonly localizationRepository: Repository<ProductLocalization>,
		private queryService: QueryService,
		private categoryService: CategoriesService,
		private subCategoryService: SubcategoriesService,
		private langService: LanguagesService,
		private readonly i18n: I18nService
	) {}

	async findAll(lang: string, queryDto?: QueryDto) {
		const { page = 1, limit = 10, search } = queryDto || {};

		// Apply pagination
		const take = limit;
		const skip = (page - 1) * limit;

		const where = search
			? {
					localizations: {
						title: Like(`%${search}%`),
						languageCode: lang,
					},
				}
			: { localizations: { languageCode: lang } };

		const [products, total] = await this.productRepo.findAndCount({
			where,
			relations: ['localizations'],
			take,
			skip,
		});

		const result = products.map(async (product) => {
			let localization = (await product.localizations).find(
				(loc) => loc.languageCode === lang
			);

			// return localization with default lang if required lang is not exist
			if (!localization) {
				const defaultLanguage = (await this.langService.findDefault()).language;
				localization = (await product.localizations).find(
					(loc) => loc.languageCode === defaultLanguage
				);
			}

			return {
				...product,
				...localization,
				localizations: undefined,
			};
		});

		return {
			data: result,
			total,
			page,
			limit,
		};
	}

	async findOne(id: number, lang: string) {
		const product = await this.productRepo.findOne({
			where: { id },
			relations: ['category', 'subcategory'],
		});

		if (!product) {
			throw new NotFoundException(this.i18n.t('exceptions.PRODUCT_NOT_FOUND'));
		}

		const localization = await this.localizationRepository.findOne({
			//@ts-ignore
			where: { product: product.id, languageCode: lang },
		});

		if (!localization) {
			throw new NotFoundException(this.i18n.t('exceptions.PRODUCT_NOT_FOUND'));
		}

		return {
			...product,
			...localization,
		};
	}

	async create(input: CreateProductInput, lang?: string) {
		// check category
		const category = await this.categoryService.findOne(input.categoryId);
		if (!category) {
			throw new NotFoundException(
				this.i18n.t('exceptions.CAT_NOT_FOUND', {
					lang,
				})
			);
		}

		// check subcategory
		let subcategory: Subcategory | null = null;
		if (input.subcategoryId) {
			subcategory = await this.subCategoryService.findOne(input.subcategoryId);
			if (!subcategory) {
				throw new NotFoundException(
					this.i18n.t('exceptions.SUB_NOT_FOUND', {
						lang,
					})
				);
			}
		}

		// check languages exist in the system
		for (const item of input.body) {
			let currentLang = item.language;

			const language = await this.langService.findByLanguage(currentLang);

			if (!language)
				throw new BadRequestException(
					`Language ${currentLang} not found in the language list`
				);
		}

		// create product
		const product = this.productRepo.create({
			price: input.price,
			quantity: input.quantity,
			imageCover: input.imageCover,
			images: input.images,
			category,
			subcategory,
		});

		const savedProduct = await this.productRepo.save(product);

		// create localization

		for (const item of input.body) {
			const localization = this.localizationRepository.create({
				languageCode: item.language,
				title: item.localization.title,
				specifications: item.localization.specifications,
				description: item.localization.description,
				product: savedProduct,
			});

			await this.localizationRepository.save(localization);
		}

		return { message: 'Product created successfully' };
	}
	async findOneAndUpdate(id: number, input: UpdateProductInput, lang: string) {
		let newBody: any = { ...input };
		// check product
		const product = await this.productRepo.findOne({ where: { id } });
		if (!product)
			throw new NotFoundException(
				this.i18n.t('exceptions.PRODUCT_NOT_FOUND', {
					lang,
				})
			);

		// check category
		if (input.categoryId) {
			const category = await this.categoryService.findOne(input.categoryId);
			if (!category) {
				throw new NotFoundException(
					this.i18n.t('exceptions.CAT_NOT_FOUND', {
						lang,
					})
				);
			}
			newBody.category = category;
		}

		// check subcategory
		if (input.subcategoryId) {
			const subCategory = await this.subCategoryService.findOne(
				input.subcategoryId
			);
			if (!subCategory) {
				throw new NotFoundException(
					this.i18n.t('exceptions.SUB_NOT_FOUND', {
						lang,
					})
				);
			}
			newBody.subcategory = subCategory;
		}

		// update product
		Object.assign(product, {
			...newBody,
			price: input.price,
			quantity: input.quantity,
			updatedAt: new Date(),
		});
		await this.productRepo.save(product);

		if (input.body) {
			const localization = await this.localizationRepository.findOne({
				where: { product: { id: product.id } },
			});
			if (!localization) {
				throw new NotFoundException(
					this.i18n.t('exceptions.LOC_NOT_FOUND', {
						lang,
					})
				);
			}
			for (const item of input.body) {
				Object.assign(localization, {
					languageCode: item.language,
					title: item.localization.title,
					specifications: item.localization.specifications,
					description: item.localization.description,
				});
				await this.localizationRepository.save(localization);
			}
		}

		return { message: 'Product updated successfully' };
	}

	async findOneAndDelete(id: number, lang?: string) {
		const product = await this.productRepo.findOne({ where: { id } });
		if (!product)
			throw new NotFoundException(
				this.i18n.t('exceptions.PRODUCT_NOT_FOUND', {
					lang,
				})
			);

		return this.productRepo.remove(product);
	}

	async getProductsByIds(productIds: number[]) {
		return await this.productRepo.find({ where: { id: In(productIds) } });
	}

	async getProductsByCategoryIds(categoryIds: number[]) {
		return await this.productRepo.find({
			where: { category: In(categoryIds) },
		});
	}

	async getProductsBySubsIds(subCategoryIds: number[]) {
		return await this.productRepo.find({
			where: { subcategory: In(subCategoryIds) },
		});
	}
}

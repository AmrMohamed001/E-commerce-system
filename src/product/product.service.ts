import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { QueryService } from './query.service';
import { CategoriesService } from 'src/category/category.service';
import { SubcategoriesService } from 'src/subcategory/subcategory.service';
import { Subcategory } from 'src/subcategory/subcategory.entity';
import { QueryDto } from './dtos/query.dto';
import { ProductLocalization } from './ProductLocalization.entity';
import { TranslationService } from 'src/translate/translate.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product) private productRepo: Repository<Product>,
		@InjectRepository(ProductLocalization)
		private readonly localizationRepository: Repository<ProductLocalization>,
		private translateService: TranslationService,
		private queryService: QueryService,
		private categoryService: CategoriesService,
		private subCategoryService: SubcategoriesService,
		private readonly i18n: I18nService
	) {}

	async findAll(lang: string, queryOpt?: QueryDto) {
		let queryBuilder = this.productRepo
			.createQueryBuilder('product')
			.leftJoinAndSelect('product.localizations', 'localization');

		// Apply search, sort, and pagination
		queryBuilder = this.queryService.applySearch(queryBuilder, queryOpt.search);

		queryBuilder = this.queryService.applySort(
			queryBuilder,
			queryOpt.sort,
			queryOpt.order
		);

		queryBuilder = this.queryService.applyPagination(
			queryBuilder,
			queryOpt.page || 1,
			queryOpt.limit || 10
		);

		const total = await queryBuilder.getCount();
		const products = await queryBuilder.getMany();

		const data = products.map(async (product) => {
			const localized = (await product.localizations).find(
				(loc) => loc.languageCode === lang
			);

			return {
				...product,
				title: localized.title,
				specifications: localized.specifications,
				description: localized.description,
			};
		});

		return {
			total,
			page: queryOpt.page || 1,
			limit: queryOpt.limit || 10,
			data,
		};
	}
	async findOne(id: number, lang: string) {
		const product = await this.productRepo.findOne({
			where: { id },
			relations: ['category', 'subcategory'],
		});

		return {
			...product,
			...(await product.localizations).find((p) => p.languageCode === lang),
		};
	}
	async create(body: CreateProductDto, lang: string = 'en') {
		const category = await this.categoryService.findOne(body.categoryId);
		if (!category) {
			throw new NotFoundException(
				this.i18n.t('exceptions.CAT_NOT_FOUND', {
					lang,
				})
			);
		}

		let subcategory: Subcategory | null = null;
		if (body.subcategoryId) {
			subcategory = await this.subCategoryService.findOne(body.subcategoryId);
			if (!subcategory) {
				throw new NotFoundException(
					this.i18n.t('exceptions.SUB_NOT_FOUND', {
						lang,
					})
				);
			}
		}

		const product = this.productRepo.create({
			price: body.price,
			quantity: body.quantity,
			imageCover: body.imageCover,
			images: body.images,
			category,
			subcategory,
		});

		const savedProduct = await this.productRepo.save(product);

		const languages = ['en', 'ar'];
		for (const lang of languages) {
			const title =
				lang === 'en'
					? body.title
					: await this.translateService.translateText(body.title, lang);
			const specifications =
				lang === 'en'
					? body.specifications
					: await this.translateService.translateText(
							body.specifications,
							lang
						);
			const description =
				lang === 'en'
					? body.description
					: await this.translateService.translateText(body.description, lang);

			return this.localizationRepository.save({
				product: savedProduct,
				languageCode: lang,
				title,
				specifications,
				description,
			});
		}
	}
	async findOneAndUpdate(id: number, body: UpdateProductDto, lang: string) {
		let newBody: any = { ...body };
		const product = await this.productRepo.findOne({ where: { id } });
		if (!product)
			throw new NotFoundException(
				this.i18n.t('exceptions.PRODUCT_NOT_FOUND', {
					lang,
				})
			);

		if (body.categoryId) {
			const category = await this.categoryService.findOne(body.categoryId);
			if (!category) {
				throw new NotFoundException(
					this.i18n.t('exceptions.CAT_NOT_FOUND', {
						lang,
					})
				);
			}

			newBody.category = category;
		}

		if (body.subcategoryId) {
			const subCategory = await this.subCategoryService.findOne(
				body.subcategoryId
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

		const localizedFields = ['title', 'specifications', 'description'];
		const nonLocalizedFields = Object.keys(body).filter(
			(field) => !localizedFields.includes(field)
		);

		nonLocalizedFields.forEach((field) => {
			product[field] = body[field];
		});
		await this.productRepo.save(product);

		let localizations = await this.localizationRepository.find({
			where: { product: { id } },
		});

		const languages = ['en', 'ar'];
		for (const lang of languages) {
			const existingLocalization = localizations.find(
				(localization) => localization.languageCode === lang
			);

			const title =
				lang === 'en'
					? body.title
					: await this.translateService.translateText(body.title, lang);
			const specifications =
				lang === 'en'
					? body.specifications
					: await this.translateService.translateText(
							body.specifications,
							lang
						);
			const description =
				lang === 'en'
					? body.description
					: await this.translateService.translateText(body.description, lang);

			if (existingLocalization) {
				existingLocalization.title = title;
				existingLocalization.specifications = specifications;
				existingLocalization.description = description;
				await this.localizationRepository.save(existingLocalization);
			} else {
				await this.localizationRepository.save({
					product: product,
					languageCode: lang,
					title,
					specifications,
					description,
				});
			}
		}

		return product;
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

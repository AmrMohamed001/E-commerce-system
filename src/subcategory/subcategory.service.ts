import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateSubcategoryDto } from './dtos/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dtos/update-subcategory.dto';
import { Subcategory } from './subcategory.entity';
import { CategoriesService } from 'src/category/category.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SubcategoriesService {
	constructor(
		@InjectRepository(Subcategory)
		private subcategoryRepos: Repository<Subcategory>,
		private categoryService: CategoriesService,
		private readonly i18n: I18nService
	) {}

	async create(body: CreateSubcategoryDto, lang?: string) {
		const { name, categoryId } = body;
		const category = await this.categoryService.findOne(categoryId);

		if (!category) {
			throw new NotFoundException(
				this.i18n.t('exceptions.CAT_NOT_FOUND', {
					lang,
				})
			);
		}
		// @ts-ignore
		const subcategory = this.subcategoryRepos.create({
			name,
			category,
		});

		return this.subcategoryRepos.save(subcategory);
	}

	async findAll() {
		return this.subcategoryRepos.find();
	}

	async findOne(id: number, lang?: string) {
		const subcategory = await this.subcategoryRepos.findOne({
			where: { id },
		});

		if (!subcategory) {
			throw new NotFoundException(
				this.i18n.t('exceptions.SUB_NOT_FOUND', {
					lang,
				})
			);
		}

		return subcategory;
	}

	async update(id: number, body: UpdateSubcategoryDto, lang?: string) {
		const subcategory = await this.subcategoryRepos.findOne({ where: { id } });

		if (!subcategory)
			throw new NotFoundException(
				this.i18n.t('exceptions.SUB_NOT_FOUND', {
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
			(await subcategory.category).id = category.id;
		}
		if (body.name) subcategory.name = body.name;
		return this.subcategoryRepos.save(subcategory);
	}

	async remove(id: number, lang?: string) {
		const subcategory = await this.subcategoryRepos.findOne({ where: { id } });
		if (!subcategory)
			throw new NotFoundException(
				this.i18n.t('exceptions.SUB_NOT_FOUND', {
					lang,
				})
			);
		await this.subcategoryRepos.remove(subcategory);
	}

	getSubcategoryByIds(subcategoryIds: number[]) {
		return this.subcategoryRepos.find({ where: { id: In(subcategoryIds) } });
	}

	getSubsByCategoryIds(categoryIds: number[]) {
		return this.subcategoryRepos.find({
			where: { category: In(categoryIds) },
		});
	}
}

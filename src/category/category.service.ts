import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category) private categoryRepo: Repository<Category>,
		private i18n: I18nService
	) {}

	async create(body: CreateCategoryDto) {
		const category = this.categoryRepo.create(body);
		return this.categoryRepo.save(category);
	}

	async findAll() {
		return this.categoryRepo.find();
	}

	async findOne(id: number, lang?: string) {
		const category = await this.categoryRepo.findOne({
			where: { id },
		});
		if (!category) {
			this.i18n.t('exceptions.CAT_NOT_FOUND', {
				lang,
			});
		}
		return category;
	}

	findByProductId(productId: number) {
		return this.categoryRepo.find({
			where: { products: { id: productId } },
		});
	}

	async update(id: number, body: UpdateCategoryDto, lang?: string) {
		const category = await this.findOne(id);

		if (!category) {
			this.i18n.t('exceptions.CAT_NOT_FOUND', {
				lang,
			});
		}
		Object.assign(category, body);

		return this.categoryRepo.save(category);
	}

	async remove(id: number, lang?: string) {
		const category = await this.findOne(id);
		if (!category) {
			this.i18n.t('exceptions.CAT_NOT_FOUND', {
				lang,
			});
		}
		await this.categoryRepo.remove(category);
	}

	getCategoryByIds(categoryIds: number[]) {
		return this.categoryRepo.find({ where: { id: In(categoryIds) } });
	}
}

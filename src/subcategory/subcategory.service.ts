import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubcategoryDto } from './dtos/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dtos/update-subcategory.dto';
import { Subcategory } from './subcategory.entity';
import { CategoriesService } from 'src/category/category.service';

@Injectable()
export class SubcategoriesService {
	constructor(
		@InjectRepository(Subcategory)
		private subcategoryRepos: Repository<Subcategory>,
		private categoryService: CategoriesService
	) {}

	async create(body: CreateSubcategoryDto) {
		const { name, categoryId } = body;
		const category = await this.categoryService.findOne(categoryId);

		if (!category) {
			throw new NotFoundException(`Category with ID ${categoryId} not found`);
		}

		const subcategory = this.subcategoryRepos.create({
			name,
			category,
		});

		return this.subcategoryRepos.save(subcategory);
	}

	async findAll() {
		return this.subcategoryRepos.find({ relations: ['category'] });
	}

	async findOne(id: number) {
		const subcategory = await this.subcategoryRepos.findOne({
			where: { id },
			relations: ['category'],
		});

		if (!subcategory) {
			throw new NotFoundException(`Subcategory with ID ${id} not found`);
		}

		return subcategory;
	}

	async update(id: number, body: UpdateSubcategoryDto) {
		const subcategory = await this.findOne(id);

		if (!subcategory)
			throw new NotFoundException(`Subcategory with ID ${id} not found`);

		if (body.categoryId) {
			const category = await this.categoryService.findOne(body.categoryId);
			if (!category) {
				throw new NotFoundException(
					`Category with ID ${body.categoryId} not found`
				);
			}
			subcategory.category = category;
		}
		if (body.name) subcategory.name = body.name;
		return this.subcategoryRepos.save(subcategory);
	}

	async remove(id: number): Promise<void> {
		const subcategory = await this.findOne(id);
		if (!subcategory)
			throw new NotFoundException(`Subcategory with ID ${id} not found`);
		await this.subcategoryRepos.remove(subcategory);
	}
}

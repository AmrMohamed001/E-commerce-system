import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category) private categoryRepo: Repository<Category>
	) {}

	async create(body: CreateCategoryDto) {
		const category = this.categoryRepo.create(body);
		return this.categoryRepo.save(category);
	}

	async findAll() {
		return this.categoryRepo.find({ relations: ['products'] });
	}

	async findOne(id: number) {
		const category = await this.categoryRepo.findOne({
			where: { id },
			relations: ['products'],
		});
		if (!category) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}
		return category;
	}

	async update(id: number, body: UpdateCategoryDto) {
		const category = await this.findOne(id);

		if (!category) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}
		Object.assign(category, body);

		return this.categoryRepo.save(category);
	}

	async remove(id: number) {
		const category = await this.findOne(id);
		if (!category) {
			throw new NotFoundException(`Category with ID ${id} not found`);
		}
		await this.categoryRepo.remove(category);
	}
}

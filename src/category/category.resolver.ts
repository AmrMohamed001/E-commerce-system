import {
	Args,
	Context,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { Category } from './category.entity';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { EntityWithId } from 'src/shared/dtos/entity-with-id.dto';
import { UseGuards } from '@nestjs/common';
import { Role } from 'src/shared/decorators/role.decorator';
import { Product } from 'src/product/product.entity';
import { Lang } from 'src/shared/decorators/lang.decorator';
import { Subcategory } from 'src/subcategory/subcategory.entity';
import { DataloaderService } from 'src/dataloader/dataloader.service';

@Resolver(() => Category)
export class CategoryResolver {
	constructor(
		private categoryService: CategoriesService,
		private dataLoader: DataloaderService
	) {}

	@ResolveField('subcategories', () => [Subcategory])
	async getSubcategories(@Parent() category: Category) {
		if (!category.subcategories) {
			return [];
		}
		return this.dataLoader.getSubcategoriesByCategoryId.load(category.id);
	}

	@ResolveField('products', () => [Product])
	async getProducts(@Parent() category: Category) {
		if (!category.products) {
			return [];
		}
		return this.dataLoader.getProductsByCategoryIds.load(category.id);
	}

	@Query(() => [Category])
	categories() {
		return this.categoryService.findAll();
	}

	@Query(() => Category)
	category(@Args('id', { type: () => Int }) id: number, @Lang() lang: string) {
		return this.categoryService.findOne(id, lang);
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => Category)
	addCategory(
		@Args('input', { type: () => CreateCategoryDto })
		createCategoryInput: CreateCategoryDto
	) {
		return this.categoryService.create(createCategoryInput);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => Category)
	editCategory(
		@Args('id', { type: () => Int })
		id: number,
		@Args('input', { type: () => UpdateCategoryDto })
		body: UpdateCategoryDto,
		@Lang() lang: string
	) {
		return this.categoryService.update(id, body, lang);
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => EntityWithId)
	async deleteCategory(
		@Args('id', { type: () => Int }) id: number,
		@Lang() lang: string
	) {
		await this.categoryService.remove(id, lang);
		return new EntityWithId(id);
	}
}

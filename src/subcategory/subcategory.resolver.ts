import {
	Args,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { Subcategory } from './subcategory.entity';
import { SubcategoriesService } from './subcategory.service';
import { CreateSubcategoryDto } from './dtos/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dtos/update-subcategory.dto';
import { EntityWithId } from 'src/shared/dtos/entity-with-id.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { Lang } from 'src/shared/decorators/lang.decorator';
import { Product } from 'src/product/product.entity';
import { DataloaderService } from 'src/dataloader/dataloader.service';

@Resolver(() => Subcategory)
export class SubCategoryResolver {
	constructor(
		private subService: SubcategoriesService,
		private dataLoader: DataloaderService
	) {}
	@Query(() => [Subcategory])
	subs() {
		return this.subService.findAll();
	}

	@Query(() => Subcategory)
	sub(@Args('id', { type: () => Int }) id: number, @Lang() lang: string) {
		return this.subService.findOne(id, lang);
	}

	@ResolveField('products', () => [Product])
	async getProducts(@Parent() subcategory: Subcategory) {
		if (!subcategory.products) {
			return [];
		}
		return this.dataLoader.getProductsBySubcategoryId.load(subcategory.id);
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => Subcategory)
	addSub(
		@Args('input', { type: () => CreateSubcategoryDto })
		body: CreateSubcategoryDto,
		@Lang() lang: string
	) {
		return this.subService.create(body, lang);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => Subcategory)
	updateSub(
		@Args('id', { type: () => Int }) id: number,
		@Args('input', { type: () => UpdateSubcategoryDto })
		body: UpdateSubcategoryDto,
		@Lang()
		lang: string
	) {
		return this.subService.update(id, body, lang);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Mutation(() => EntityWithId)
	async deleteSub(
		@Args('id', { type: () => Int }) id: number,
		@Lang() lang: string
	) {
		await this.subService.remove(id, lang);
		return new EntityWithId(id);
	}
}

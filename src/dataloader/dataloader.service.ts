import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { CategoriesService } from 'src/category/category.service';
import { ProductService } from 'src/product/product.service';
import { SubcategoriesService } from 'src/subcategory/subcategory.service';

@Injectable()
export class DataloaderService {
	constructor(
		private productService: ProductService,
		private categoryService: CategoriesService,
		private subCategoryService: SubcategoriesService
	) {}

	getProductsByCategoryIds = new DataLoader(async (catIds: number[]) => {
		const products = await this.productService.getProductsByCategoryIds(catIds);

		const productMap = new Map(
			catIds.map((id) => [
				id,
				products.filter(async (product) => (await product.category.id) === id),
			])
		);

		return catIds.map((id) => productMap.get(id));
	});

	getProductsBySubcategoryId = new DataLoader(async (subCatIds: number[]) => {
		const products = await this.productService.getProductsBySubsIds(subCatIds);
		const productMap = new Map(
			subCatIds.map((id) => [
				id,
				products.filter(
					async (product) => (await product.subcategory.id) === id
				),
			])
		);
		return subCatIds.map((id) => productMap.get(id));
	});

	getSubcategoriesByCategoryId = new DataLoader(async (catIds: number[]) => {
		const subcategories =
			await this.subCategoryService.getSubsByCategoryIds(catIds);

		const subcategoryMap = new Map(
			catIds.map((id) => [
				id,
				subcategories.filter(
					async (subcategory) => (await subcategory.category).id === id
				),
			])
		);

		return catIds.map((id) => subcategoryMap.get(id));
	});

	getCategoryByProductId = new DataLoader(async (catIds: number[]) => {
		const categories = await this.categoryService.getCategoryByIds(catIds);
		const catMap = new Map(
			catIds.map((catId) => [
				catId,
				categories.filter((category) => category.id === catId),
			])
		);
		return catIds.map((catId) => catMap.get(catId));
	});
}

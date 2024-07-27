import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class QueryService {
	constructor() {}
	applySearch(
		queryBuilder: SelectQueryBuilder<Product>,
		search?: string
	): SelectQueryBuilder<Product> {
		if (search) {
			queryBuilder.where(
				'product.title ILIKE :search OR product.description ILIKE :search',
				{ search: `${search}%` }
			);
		}
		return queryBuilder;
	}

	applySort(
		queryBuilder: SelectQueryBuilder<Product>,
		sort?: string,
		order?: string
	): SelectQueryBuilder<Product> {
		if (sort) {
			queryBuilder.orderBy(
				`product.${sort}`,
				order.toUpperCase() as 'ASC' | 'DESC'
			);
		}
		queryBuilder.orderBy('product.createdAt', 'DESC');
		return queryBuilder;
	}

	applyPagination(
		queryBuilder: SelectQueryBuilder<Product>,
		page: number,
		limit: number
	): SelectQueryBuilder<Product> {
		queryBuilder.skip((page - 1) * limit).take(limit);
		return queryBuilder;
	}
}

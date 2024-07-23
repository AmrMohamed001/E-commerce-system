import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto {
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsString()
	sort?: string;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	page?: number;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	limit?: number;
}

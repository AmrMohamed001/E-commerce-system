import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/shared/decorators/role.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetProductsDto } from './dtos/get-products.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('products')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Get()
	@ApiQuery({
		name: 'sort',
		required: false,
		type: String,
		description: 'sort products with any field',
	})
	@ApiQuery({
		name: 'search',
		required: false,
		type: String,
		description: 'search products with title and description',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'specify page number for pagination',
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		description: 'limit products per page',
	})
	getAllProducts(@Query() query: GetProductsDto) {
		return this.productService.findAll(query);
	}

	@Get(':id')
	async getProductById(@Param('id') id: string) {
		const product = await this.productService.findOne(parseInt(id));
		if (!product)
			throw new NotFoundException(`product with this id ${id} is not found`);
		return product;
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Post()
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'imageCover', maxCount: 1 },
			{ name: 'images', maxCount: 5 },
		])
	)
	async createProduct(
		@UploadedFiles()
		files: { imageCover: Express.Multer.File[]; images: Express.Multer.File[] },
		@Body() body: CreateProductDto
	) {
		const coverImage = files['imageCover'] ? files['imageCover'][0] : null;
		const images = files['images'] ? files['images'] : [];

		if (!coverImage || images.length === 0)
			throw new NotFoundException('product not created');

		const coverImagePath = `/uploads/products/${coverImage.filename}`;
		const imagesPaths = images.map(
			(file) => `/uploads/products/${file.filename}`
		);

		const productData = {
			...body,
			imageCover: coverImagePath,
			images: imagesPaths,
		};

		return this.productService.create(productData);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Patch(':id')
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'imageCover', maxCount: 1 },
			{ name: 'images', maxCount: 5 },
		])
	)
	async updateProduct(
		@Param('id') id: string,
		@Body() body: UpdateProductDto,
		@UploadedFiles()
		files: {
			imageCover?: Express.Multer.File[];
			images?: Express.Multer.File[];
		}
	) {
		const existingProduct = await this.productService.findOne(parseInt(id));
		if (!existingProduct) {
			throw new NotFoundException(`Product with ID ${id} not found`);
		}

		let coverImagePath = existingProduct.imageCover;
		let imagesPaths = existingProduct.images || [];

		if (files) {
			if (files.imageCover && files.imageCover.length > 0) {
				coverImagePath = `/uploads/products/${files.imageCover[0].filename}`;
			}

			if (files.images) {
				imagesPaths = files.images.map(
					(file) => `/uploads/products/${file.filename}`
				);
			}
		}

		const productData = {
			...body,
			imageCover: files?.imageCover
				? coverImagePath
				: existingProduct.imageCover,
			images: files?.images ? imagesPaths : existingProduct.images,
		};

		return this.productService.findOneAndUpdate(parseInt(id), productData);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Role('admin')
	@Delete(':id')
	deleteProduct(@Param('id') id: string) {
		return this.productService.findOneAndDelete(parseInt(id));
	}
}

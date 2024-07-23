import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	@Get()
	findAll() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.categoriesService.findOne(parseInt(id));
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Post()
	create(@Body() body: CreateCategoryDto) {
		return this.categoriesService.create(body);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
		return this.categoriesService.update(parseInt(id), body);
	}

	@UseGuards(AuthGuard, RoleGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.categoriesService.remove(parseInt(id));
	}
}

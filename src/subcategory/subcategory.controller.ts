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
import { CreateSubcategoryDto } from './dtos/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dtos/update-subcategory.dto';
import { SubcategoriesService } from './subcategory.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('subcategories')
@ApiTags('subcategories')
export class SubcategoriesController {
	constructor(private readonly subcategoriesService: SubcategoriesService) {}

	@Get()
	findAll() {
		return this.subcategoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.subcategoriesService.findOne(parseInt(id));
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Post()
	create(@Body() body: CreateSubcategoryDto) {
		return this.subcategoriesService.create(body);
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() body: UpdateSubcategoryDto) {
		return this.subcategoriesService.update(parseInt(id), body);
	}
	@UseGuards(AuthGuard, RoleGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.subcategoriesService.remove(parseInt(id));
	}
}

import { CreateSubcategoryDto } from './create-subcategory.dto';
import { InputType, PartialType } from '@nestjs/graphql';
@InputType()
export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}

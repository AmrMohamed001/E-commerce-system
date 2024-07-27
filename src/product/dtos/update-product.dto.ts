import { CreateProductDto } from './create-product.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductDto extends PartialType(CreateProductDto) {}

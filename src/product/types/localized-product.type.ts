import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/category/category.entity';
import { Subcategory } from 'src/subcategory/subcategory.entity';

/*
{
  id: 2,
  price: '453',
  quantity: 789,
  imageCover: '/uploads/product-cover/1721935811120-Screenshot 2024-07-02 144053.png',
  images: [
    '/uploads/products/1721935811125-Screenshot 2024-06-27 183945.png',
    '/uploads/products/1721935811136-Screenshot 2024-06-27 184546.png',
    '/uploads/products/1721935811152-Screenshot 2024-06-30 231621.png',
    '/uploads/products/1721935811156-Screenshot 2024-07-01 234738.png'
  ],
  createdAt: 2024-07-25T19:30:11.344Z,
  category: Category { id: 2, name: 'afteredit' },
  subcategory: Subcategory { id: 2, name: 'sub2' },
  languageCode: 'ar',
  title: 'المنتج الاول',
  specifications: 'الالاسيبسيب',
  description: 'سشيشسيشسي'
}
*/
@ObjectType()
export class LocalizedProduct {
	@Field(() => Int)
	id: number;
	@Field()
	price: string;
	@Field(() => Int)
	quantity: number;
	@Field()
	imageCover: string;
	@Field(() => [String])
	images: string[];
	@Field(() => Date)
	createdAt: Date;
	@Field(() => Category, { nullable: true })
	category: Category;
	@Field(() => Subcategory, { nullable: true })
	subcategory: Subcategory;
	@Field()
	languageCode: string;
	@Field()
	title: string;
	@Field()
	specifications: string;
	@Field()
	description: string;
}

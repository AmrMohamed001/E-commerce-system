import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class Subcategory {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column()
	@Field()
	name: string;

	@Field(() => Category)
	@ManyToOne(() => Category, (category) => category.subcategories)
	category: Promise<Category>;

	@Field(() => [Product], { nullable: true })
	@OneToMany(() => Product, (product) => product.subcategory)
	products: Promise<Product[]>;
}

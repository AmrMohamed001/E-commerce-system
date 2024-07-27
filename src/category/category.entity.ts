import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { Subcategory } from 'src/subcategory/subcategory.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Category {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Column()
	@Field()
	name: string;

	@Field(() => [Subcategory])
	@OneToMany(() => Subcategory, (subcategory) => subcategory.category)
	subcategories: Promise<Subcategory[]>;

	@Field(() => [Product])
	@OneToMany(() => Product, (product) => product.category)
	products: Promise<Product[]>;
}

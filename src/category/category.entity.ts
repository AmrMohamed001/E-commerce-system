import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { Subcategory } from 'src/subcategory/subcategory.entity';

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Subcategory, (subcategory) => subcategory.category)
	subcategories: Subcategory[];

	@OneToMany(() => Product, (product) => product.category)
	products: Product[];
}

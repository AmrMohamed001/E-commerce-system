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
export class Subcategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => Category, (category) => category.subcategories)
	category: Category;

	@OneToMany(() => Product, (product) => product.subcategory)
	products: Product[];
}

import { Category } from 'src/category/category.entity';
import { Subcategory } from 'src/subcategory/subcategory.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['title', 'price'])
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	specifications: string;

	@Column('decimal')
	price: number;

	@Column('int')
	quantity: number;

	@Column({ nullable: true })
	imageCover: string;

	@Column('jsonb', { nullable: true })
	images: string[];

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Category, (category) => category.products)
	category: Category;

	@ManyToOne(() => Subcategory, (subcategory) => subcategory.products, {
		nullable: true,
	})
	subcategory: Subcategory;
}

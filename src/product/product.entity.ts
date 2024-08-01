import { Field, Int, ObjectType } from '@nestjs/graphql';
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
import { ProductLocalization } from './ProductLocalization.entity';

@Entity()
// @Index(['title', 'price'])
@ObjectType()
export class Product {
	@PrimaryGeneratedColumn()
	@Field(() => Int)
	id: number;

	@Field(() => [ProductLocalization])
	@OneToMany(
		() => ProductLocalization,
		(productLocalization) => productLocalization.product
	)
	localizations: Promise<ProductLocalization[]>;

	@Column('decimal')
	@Field(() => Int)
	price: number;

	@Column('int')
	@Field(() => Int)
	quantity: number;

	@Column({ nullable: true })
	@Field({ nullable: true })
	imageCover: string;

	@Column('jsonb', { nullable: true })
	@Field(() => [String])
	images: string[];

	@CreateDateColumn()
	@Field(() => Date)
	createdAt: Date;

	@Column({ nullable: true, type: 'timestamp with time zone' })
	@Field(() => Date)
	updatedAt: Date;

	@ManyToOne(() => Category, (category) => category.products)
	@Field(() => Category, { nullable: true })
	category: Category;

	@ManyToOne(() => Subcategory, (subcategory) => subcategory.products, {
		nullable: true,
		onDelete: 'SET NULL',
	})
	@Field(() => Subcategory, { nullable: true })
	subcategory: Subcategory | null;
}

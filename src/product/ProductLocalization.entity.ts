import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@ObjectType()
@Entity()
export class ProductLocalization {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	languageCode: string;

	@Field()
    @Column()
        @Index()
	title: string;

	@Field()
	@Column()
	specifications: string;

	@Field()
	@Column()
	description: string;

	@ManyToOne(() => Product, (product) => product.localizations)
	product: Product;
}

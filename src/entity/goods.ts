import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goods {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	goods_name: string;

	@Column()
	goods_count: number;

	@Column()
	goods_from: string;

	@Column()
	goods_life: number;

	@Column()
	goods_birth_time: string;

	@Column()
	goods_price: number;

	@Column()
	goods_category: string;

	@Column()
	goods_seller_id: string;
}

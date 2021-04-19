import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	order_create_time: string;

	@Column()
	order_finish_time: number;

	@Column()
	order_address: number;

	@Column()
	order_goods_id: string;

	@Column()
	order_seller_id: number;

	@Column()
	order_buyer_id: number;
}

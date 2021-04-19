import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	address_detail: string;

	@Column()
	telephone: number;

	@Column()
	addressee: number;

	@Column()
	user_id: number;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Dataset {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsNotEmpty()
	title: string;

	@Column()
	@IsNotEmpty()
	dataset: string;

	@Column()
	@IsNotEmpty()
	user_id: number;
}

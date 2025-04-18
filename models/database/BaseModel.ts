import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export abstract class BaseModel {
	@PrimaryGeneratedColumn()
	Id?: number;

	@CreateDateColumn()
	CreatedAt?: Date;

	@UpdateDateColumn()
	UpdatedAt?: Date;

	@DeleteDateColumn({ nullable: true })
	DeletedAt?: Date | null;
}

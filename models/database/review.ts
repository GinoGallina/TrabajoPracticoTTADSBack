import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Product } from "./Product.js";
import { User } from "./User.js";

@Entity("Review")
export class Review extends BaseModel {
	@Column({ type: "varchar", length: 350 })
	Description!: string;

	@Column({ type: "int" })
	Rate!: number;

	@Column({ type: "int" })
	ProductId!: number;

	@Column({ type: "int" })
	UserId!: number;

	@ManyToOne(() => Product, (product) => product.Reviews)
	@JoinColumn({ name: "ProductId" })
	Product!: Product;

	@ManyToOne(() => User, (user) => user.Reviews)
	@JoinColumn({ name: "UserId" })
	User!: User;

	constructor(init?: Partial<Review>) {
		super();
		Object.assign(this, init);
	}
}

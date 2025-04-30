import { Entity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Product } from "./Product.js";
import { Role } from "./Role.js";
import { Order } from "./Order.js";
import { Review } from "./review.js";

@Entity("User")
export class User extends BaseModel {
	@Column({ type: "varchar", unique: true })
	Email!: string;

	@Column({ type: "varchar", unique: true })
	Username!: string;

	@Column({ type: "varchar" })
	Password!: string;

	@Column({ type: "varchar" })
	Address!: string;

	// Seller fields
	@Column({ type: "varchar", nullable: true })
	StoreName?: string;

	@Column({ type: "text", nullable: true })
	StoreDescription?: string;

	@Column({ type: "varchar", nullable: true })
	Cbu?: string;

	@Column({ type: "varchar", nullable: true })
	Cuit?: string;

	@OneToMany(() => Product, (product) => product.Category)
	Products!: Product[];

	@OneToMany(() => Order, (order) => order.User)
	Orders!: Order[];

	@OneToMany(() => Review, (item) => item.Product)
	Reviews!: Review[];

	@ManyToMany(() => Role, { eager: true })
	@JoinTable({
		name: "UserRoles",
		joinColumn: { name: "UserId", referencedColumnName: "Id" },
		inverseJoinColumn: { name: "RoleId", referencedColumnName: "Id" },
	})
	Roles!: Role[];

	constructor(init?: Partial<User>) {
		super();
		Object.assign(this, init);
	}
}

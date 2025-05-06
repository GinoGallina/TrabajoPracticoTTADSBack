import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Category } from "./Category.js";
import { User } from "./User.js";
import { OrderItem } from "./OrderItem.js";
import { Review } from "./Review.js";

@Entity("Product")
export class Product extends BaseModel {
	@Column({ type: "varchar", unique: true })
	Name!: string;

	@Column({ type: "varchar" })
	Description!: string;

	@Column({ type: "decimal" })
	Price!: number;

	@Column({ type: "int", default: 0 })
	Stock!: number;

	@Column({ type: "varchar", nullable: true })
	Image?: string;

	@Column({ type: "int" })
	CategoryId!: number;

	@Column({ type: "int" })
	UserId!: number;

	@ManyToOne(() => User, (user) => user.Products)
	@JoinColumn({ name: "UserId" })
	User!: User;

	@ManyToOne(() => Category, (category) => category.Products)
	@JoinColumn({ name: "CategoryId" })
	Category!: Category;

	@OneToMany(() => OrderItem, (item) => item.Product)
	OrderItems!: OrderItem[];

	@OneToMany(() => Review, (item) => item.Product)
	Reviews!: Review[];

	constructor(init?: Partial<Product>) {
		super();
		Object.assign(this, init);
	}
}

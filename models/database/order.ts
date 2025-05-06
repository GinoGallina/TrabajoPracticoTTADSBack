import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { User } from "./User.js";
import { PaymentType } from "./PaymentType.js";
import { OrderItem } from "./OrderItem.js";
import { OrderEnum } from "../../types/IOrder.js";

@Entity("Order")
export class Order extends BaseModel {
	@Column("decimal", { precision: 10, scale: 2 })
	TotalPrice!: number;

	@Column({
		type: "enum",
		enum: OrderEnum,
		default: OrderEnum.Pending,
	})
	Status!: OrderEnum;

	@Column({ type: "varchar" })
	ShippingAddress!: string;

	@Column({ type: "timestamp", nullable: true })
	CanceledAt?: Date | null;

	@Column({ type: "int" })
	PaymentTypeId!: number;

	@Column({ type: "int" })
	UserId!: number;

	@ManyToOne(() => User, (user) => user.Orders)
	@JoinColumn({ name: "UserId" })
	User?: User;

	@ManyToOne(() => PaymentType, (paymentType) => paymentType.Orders)
	@JoinColumn({ name: "PaymentTypeId" })
	PaymentType?: PaymentType;

	@OneToMany(() => OrderItem, (item) => item.Order, { cascade: true })
	OrderItems!: OrderItem[];

	constructor(init?: Partial<Order>) {
		super();
		Object.assign(this, init);
	}
}

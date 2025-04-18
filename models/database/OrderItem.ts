import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Product } from "./Product.js";
import { Order } from "./Order.js";
import { OrderItemEnum } from "../../types/IOrderItem.js";

@Entity("OrderItem")
export class OrderItem extends BaseModel {
	@Column({ type: "int" })
	Quantity!: number;

	@Column({
		type: "enum",
		enum: OrderItemEnum,
		default: OrderItemEnum.Pending,
	})
	Status!: OrderItemEnum;

	@Column({ type: "int" })
	ProductId!: number;

	@JoinColumn({ name: "ProductId" })
	Product?: Product;

	@ManyToOne(() => Order, (order) => order.OrderItems)
	Order?: Order;
}

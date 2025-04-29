import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Product } from "./Product.js";
import { Order } from "./Order.js";
import { OrderItemEnum } from "../../types/IOrderItem.js";

@Entity("OrderItem")
export class OrderItem extends BaseModel {
	@Column({ type: "int" })
	Quantity!: number;

	@Column({ type: "int" })
	SettedPrice!: number;

	@Column({
		type: "enum",
		enum: OrderItemEnum,
		default: OrderItemEnum.Pending,
	})
	Status!: OrderItemEnum;

	@Column({ type: "int" })
	ProductId!: number;

	@Column({ type: "int" })
	OrderId?: number;

	@ManyToOne(() => Product, (product) => product.OrderItems)
	@JoinColumn({ name: "ProductId" })
	Product?: Product;

	@ManyToOne(() => Order, (order) => order.OrderItems)
	@JoinColumn({ name: "OrderId" })
	Order?: Order;
}

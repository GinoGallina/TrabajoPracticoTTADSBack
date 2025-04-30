import { Entity, Column, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Order } from "./Order.js";

@Entity("PaymentType")
export class PaymentType extends BaseModel {
	@Column({ type: "varchar", unique: true })
	Name!: string;

	@OneToMany(() => Order, (order) => order.PaymentType)
	Orders!: Order[];

	constructor(init?: Partial<PaymentType>) {
		super();
		Object.assign(this, init);
	}
}

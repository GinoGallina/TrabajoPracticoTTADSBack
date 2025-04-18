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

	@Column({ type: "int" })
	PaymentTypeId!: number;

	@Column({ type: "int" })
	UserId!: number;

	@ManyToOne(() => User, (user) => user.Products)
	@JoinColumn({ name: "UserId" })
	User?: User;

	@JoinColumn({ name: "PaymentTypeId" })
	PaymentType?: PaymentType;

	@OneToMany(() => OrderItem, (item) => item.Order, { cascade: true })
	OrderItems!: OrderItem[];

	constructor(init?: Partial<Order>) {
		super();
		Object.assign(this, init);
	}
}

// import mongoose, { Schema, Document, Model } from "mongoose";
// import IOrder from "../../types/IOrder";

// interface IOrderDocument extends IOrder, Document {}

// const orderSchema = new Schema(
//   {
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product", // Assuming you have a Product model
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     shipment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Shipment", // Assuming you have a Shipment model
//       required: false, // Making it optional as indicated by the "?"
//     },
//     cart: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Cart", // Assuming you have a Cart model
//       required: true,
//     },
//     state: {
//       type: String,
//       enum: ["Pending", "Completed", "Cancelled"],
//       default: "Pending",
//     },
//     unitPrice: {
//       type: Number,
//       required: true,
//     },
//     completedAt: {
//       type: Date,
//       required: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// orderSchema.set("toObject", { virtuals: true });
// orderSchema.set("toJSON", { virtuals: true });

// const Order: Model<IOrderDocument> = mongoose.model<IOrderDocument>(
//   "Order",
//   orderSchema
// );

// export { Order, IOrderDocument };

import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Category } from "./Category.js";
import { User } from "./User.js";

@Entity("Cart")
export class Cart extends BaseModel {
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
}

// import mongoose, { Schema, Document, Model } from "mongoose";
// import ICart from "../../types/ICart";

// interface ICartDocument extends ICart, Document {}

// const cartSchema = new Schema(
//   {
//     state: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     payment_type: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentType" },
//   },
//   {
//     timestamps: true,
//   }
// );

// cartSchema.virtual("orders", {
//   ref: "Order",
//   localField: "_id",
//   foreignField: "cart",
// });
// cartSchema.set("toObject", { virtuals: true });
// cartSchema.set("toJSON", { virtuals: true });

// const Cart: Model<ICartDocument | undefined> = mongoose.model<
//   ICartDocument | undefined
// >("Cart", cartSchema);

// export { Cart, ICartDocument };

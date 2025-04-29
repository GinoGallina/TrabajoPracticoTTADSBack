import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Category } from "./Category.js";
import { User } from "./User.js";
import { OrderItem } from "./OrderItem.js";

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
}

// import mongoose, { Schema, Document, Model } from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

// interface IProductDocument extends IProduct, Document {}

// const productSchema = new Schema(
//   {
//     seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
//     name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: String,
//       required: true,
//     },
//     stock: {
//       type: Number,
//       required: true,
//     },
//     img: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//       enum: ["Active", "Archived"],
//       required: false,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );
// productSchema.index({ name: 1, seller_id: 1 }, { unique: true });

// productSchema.plugin(mongooseUniqueValidator, {
//   message: "Error, product has to be unique.",
// });
// const Product: Model<IProductDocument> = mongoose.model<IProductDocument>(
//   "Product",
//   productSchema,
// );
// export { Product, IProductDocument };

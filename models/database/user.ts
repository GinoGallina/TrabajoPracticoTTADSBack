import { Entity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Product } from "./Product.js";
import { Role } from "./Role.js";
import { Order } from "./Order.js";

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

	@ManyToMany(() => Role, { eager: true })
	@JoinTable({
		name: "UserRoles",
		joinColumn: { name: "UserId", referencedColumnName: "Id" },
		inverseJoinColumn: { name: "RoleId", referencedColumnName: "Id" },
	})
	Roles!: Role[];
}

// import mongoose, { Document, Schema, Model } from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

// interface IUserDocument extends IUser, Document {}

// function isSellerType(this: IUserDocument): boolean {
//   return this.type == "Seller";
// }

// export const userSchema = new Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     uniqueCaseInsensitive: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     uniqueCaseInsensitive: true,
//   },
//   type: {
//     type: String,
//     enum: ["Admin", "User", "Seller"],
//     required: true,
//     default: "User",
//   },
//   password: { type: String, required: false, trim: true },
//   address: { type: String, required: false },
//   state: { type: String, default: "Active" },
//   cbu: {
//     type: String,
//     required: function (this: any) {
//       return isSellerType.call(this);
//     },
//   },
//   shop_name: {
//     type: String,
//     required: function (this: any) {
//       return isSellerType.call(this);
//     },
//   },
//   cuit: {
//     type: String,
//     required: function (this: any) {
//       return isSellerType.call(this);
//     },
//   },
// });

// userSchema.plugin(mongooseUniqueValidator);

// const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
//   "User",
//   userSchema
// );

// export { User, IUserDocument };

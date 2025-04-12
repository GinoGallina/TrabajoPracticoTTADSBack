import { Entity, Column, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel.js";
import { Product } from "./Product.js";

@Entity("Category")
export class Category extends BaseModel {
	@Column({ type: "varchar", unique: true })
	Name!: string;

	@OneToMany(() => Product, (product) => product.Category)
	Products!: Product[];
}

// import mongoose, { Schema, Document, Model } from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

// interface ICategoryDocument extends ICategory, Document {}

// const categorySchema: Schema<ICategoryDocument> = new mongoose.Schema(
//   {
//     category: {
//       type: String,
//       required: [true, "Category must have a name"],
//       unique: true,
//       uniqueCaseInsensitive: [
//         true,
//         "Cant have two categories with the same name",
//       ],
//     },
//     state: { type: String, enum: ["Active", "Archived"], default: "Active" },
//   },
//   {
//     timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
//   }
// );

// categorySchema.plugin(mongooseUniqueValidator);
// categorySchema.virtual("discounts", {
//   ref: "Discount",
//   localField: "_id",
//   foreignField: "category",
// });
// categorySchema.set("toObject", { virtuals: true });
// categorySchema.set("toJSON", { virtuals: true });
// const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>(
//   "Category",
//   categorySchema
// );

// export { Category, ICategoryDocument };

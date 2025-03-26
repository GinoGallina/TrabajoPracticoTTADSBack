// import mongooseUniqueValidator from "mongoose-unique-validator";

// import mongoose, { Document, Schema, Model } from "mongoose";
// import IDiscount from "../../types/IDiscount.js";

// interface IDiscountDocument extends IDiscount, Document {}

// const discountSchema: Schema<IDiscountDocument> = new mongoose.Schema(
//   {
//     value: {
//       type: Number,
//       required: [true, "Discount must have a value"],
//       min: [1, "Value must be at least 1"],
//       max: [100, "Value must be 100 or lower"],
//     },
//     state: { type: String, enum: ["Active", "Archived"], default: "Active" },
//     category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Referencia a la categoría
//   },
//   {
//     timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
//   }
// );

// discountSchema.plugin(mongooseUniqueValidator);
// const Discount: Model<IDiscountDocument> = mongoose.model<IDiscountDocument>(
//   "Discount",
//   discountSchema
// );

// export { Discount, IDiscountDocument };

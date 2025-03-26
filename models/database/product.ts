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

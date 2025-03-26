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

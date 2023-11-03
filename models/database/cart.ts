import mongoose, { Schema, Document, Model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import ICart from "../../types/ICart";

interface ICartDocument extends ICart, Document {}

const cartSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    payment_type: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentType" },
    state: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  },
  {
    timestamps: true,
  }
);

cartSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "cart",
});
cartSchema.set("toObject", { virtuals: true });
cartSchema.set("toJSON", { virtuals: true });

cartSchema.plugin(mongooseUniqueValidator, {
  message: "Error, cart has to be unique.",
});

const Cart: Model<ICartDocument> = mongoose.model<ICartDocument>(
  "Cart",
  cartSchema
);

export { Cart, ICartDocument };

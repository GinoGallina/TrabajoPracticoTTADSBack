import mongoose, { Schema, Document, Model } from "mongoose";
import ICart from "../../types/ICart";

interface ICartDocument extends ICart, Document {}

const cartSchema = new Schema(
  {
    state: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    payment_type: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentType" },
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

const Cart: Model<ICartDocument | undefined> = mongoose.model<
  ICartDocument | undefined
>("Cart", cartSchema);

export { Cart, ICartDocument };

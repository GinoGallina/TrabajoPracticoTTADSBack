import mongoose, { Schema, Document, Model } from "mongoose";
import IOrder from "../../types/IOrder";

interface IOrderDocument extends IOrder, Document {}

const orderSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming you have a Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart", // Assuming you have a Cart model
      required: true,
    },
    state: {
      type: String,
      enum: ["Completed", "Cancelled"],
      default: "Completed",
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      required: false,
    },
    //Shipment data
    shipment_type: {
      type: String,
      enum: ["home_delivery", "branch_office_pickup", "other"],
      required: [true, "Shipment Type cannot be empty"],
    },
    delivery_address: {
      type: String,
      required: false
    },
    comment: {
      type: String,
      required: false,
    },
    situation: {
      type: String,
      enum: ["In Transit", "Received"],
      default: "In Transit",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });

const Order: Model<IOrderDocument> = mongoose.model<IOrderDocument>(
  "Order",
  orderSchema
);

export { Order, IOrderDocument };

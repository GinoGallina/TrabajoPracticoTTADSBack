import mongoose, { Schema, Document, Model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

interface IOrderDocument extends IOrder, Document {}

const orderSchema: Schema<IOrderDocument> = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Order must have a product"]
    },
    unitprize: {
      type: Number,
      required: [true, "Order must have a unitprize"]
    },
    quantity: {
      type: Number,
      required: [true, "Order must have a quantity"]
    },
    amount: {
      type: Number,
      required: [true, "Order must have an amount"]
    },
    state: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
      required: [true, "Order must have a state"]
    },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: false
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: [true, "Order must have a cart"]
    },
    completedAt: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
  }
);

orderSchema.plugin(mongooseUniqueValidator);
const Order: Model<IOrderDocument> = mongoose.model<IOrderDocument>(
  "Order",
  orderSchema
);

export { Order, IOrderDocument };

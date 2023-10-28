import mongoose, { Schema, Document, Model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

interface IShipmentDocument extends IShipment, Document {}

const shipmentSchema: Schema<IShipmentDocument> = new mongoose.Schema(
  {
    delivery_date: {
      type: Date,
    },
    comment: {
      type: String,
      required: [true, "Review must have a comment"],
    },
    state: { type: String, enum: ["Active", "Archived"], default: "Active" },
    situation: {
      type: String,
      enum: ["Pending", "In Transit", "Delivered"],
      default: "Pending",
    },
    // order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } // Referencia a la categoría
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

shipmentSchema.plugin(mongooseUniqueValidator);
const Shipment: Model<IShipmentDocument> = mongoose.model<IShipmentDocument>(
  "Shipment",
  shipmentSchema,
);

export { Shipment, IShipmentDocument };

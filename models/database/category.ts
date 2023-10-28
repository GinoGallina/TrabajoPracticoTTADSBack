import mongoose, { Schema, Document, Model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

interface ICategoryDocument extends ICategory, Document {}

const categorySchema: Schema<ICategoryDocument> = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category must have a name"],
      unique: true,
      uniqueCaseInsensitive: [
        true,
        "Cant have two categories with the same name",
      ],
    },
    state: { type: String, enum: ["Active", "Archived"], default: "Active" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

categorySchema.plugin(mongooseUniqueValidator);
const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>(
  "Category",
  categorySchema,
);

export { Category, ICategoryDocument };

import mongoose, { Document, Schema, Model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

interface IUserDocument extends IUser, Document {}

function isSellerType(this: IUserDocument): boolean {
  return this.type == "Seller";
}

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  type: { type: String, enum: ["Admin", "User", "Seller"], required: true },
  password: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  state: { type: String, default: "Active" },
  cbu: {
    type: String,
    required: function (this: any) {
      return isSellerType.call(this);
    },
  },
  shop_name: {
    type: String,
    required: function (this: any) {
      return isSellerType.call(this);
    },
  },
  cuit: {
    type: String,
    required: function (this: any) {
      return isSellerType.call(this);
    },
  },
});

userSchema.plugin(mongooseUniqueValidator);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  userSchema,
);

export { User, IUserDocument };

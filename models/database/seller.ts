import { Schema, Model, Document, model } from 'mongoose';
import { commonSchemaFields } from './schemas/userCommonSchemaFields.js';
import mongooseUniqueValidator from 'mongoose-unique-validator';
interface ISellerDocument extends ISeller, Document {}

const sellerSchemaFields = {
  cbu: { type: String, required: true },
  shop_name: { type: String, required: true },
  cuit: { type: String, required: true },
};

const sellerSchema: Schema<ISellerDocument> = new Schema(
  {
    ...commonSchemaFields,
    ...sellerSchemaFields,
  },
  {
    timestamps: true,
  }
);

sellerSchema.plugin(mongooseUniqueValidator);


const Seller: Model<ISellerDocument> = model<ISellerDocument>('Seller', sellerSchema);

export default Seller;

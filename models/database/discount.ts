
import mongooseUniqueValidator from 'mongoose-unique-validator'

import mongoose, { Document, Schema, Model } from 'mongoose';

interface IDiscount extends Document {
  value: number;
  state: 'Active' | 'Archived';
  category: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const discountSchema : Schema<IDiscount> = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Discount must have a value'],
    min: [1, 'Value must be at least 1'],
    max: [100, 'Value must be 100 or lower']
  },
  state: { type: String,
           enum: ['Active', 'Archived'], 
           default: 'Active' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // Referencia a la categoría
},
{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

discountSchema.plugin(mongooseUniqueValidator)
const Discount = mongoose.model('Discount', discountSchema)

export default Discount

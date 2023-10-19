import mongoose, { Document, Schema, Model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import IPaymentType from '../../types/IPaymentType.js';

interface IPaymentTypeDocuemnt extends IPaymentType, Document{}

const PaymentTypeSchema: Schema<IPaymentTypeDocuemnt> = new mongoose.Schema({
  type: {
    type: String,
    unique: true,
    required: [true, 'Payment Type must have a name']
  },
  state: {
    type: String,
    enum: ['Active', 'Archived'],
    default: 'Active'
  } 
},
{
  timestamps: true
})

PaymentTypeSchema.plugin(mongooseUniqueValidator)

const PaymentType: Model<IPaymentTypeDocuemnt> = mongoose.model<IPaymentTypeDocuemnt>('PaymentType', PaymentTypeSchema)

export  { PaymentType, IPaymentTypeDocuemnt }

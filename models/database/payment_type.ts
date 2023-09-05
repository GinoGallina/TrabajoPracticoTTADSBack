import mongoose, { Model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

interface IPaymentType{
  type: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IPaymentTypeDocument extends IPaymentType, Document {}

const PaymentTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    unique: [true, 'Cant have two Payment Types with the same name'],
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

//const PaymentType = mongoose.model('PaymentType', PaymentTypeSchema)
const PaymentType: Model<IPaymentTypeDocument> = mongoose.model<IPaymentTypeDocument>('PaymentType', PaymentTypeSchema);

export default PaymentType

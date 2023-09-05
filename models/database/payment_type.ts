import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

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

const PaymentType = mongoose.model('PaymentType', PaymentTypeSchema)

export default PaymentType

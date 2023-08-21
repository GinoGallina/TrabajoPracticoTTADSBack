import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const PaymentTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    unique: true,
    required: true
  }
},
{
  timestamps: true
})

PaymentTypeSchema.plugin(mongooseUniqueValidator)

const PaymentType = mongoose.model('PaymentType', PaymentTypeSchema)

export default PaymentType

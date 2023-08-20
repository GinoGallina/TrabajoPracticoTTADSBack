import mongoose from 'mongoose'

const PaymentTypeSchema = new mongoose.Schema({
  payment_id: String,
  type: String
})

const PaymentType = mongoose.model('PaymentType', PaymentTypeSchema)

export default PaymentType

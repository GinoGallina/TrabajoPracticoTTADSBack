import mongoose from 'mongoose';


const payment_typeSchema = new mongoose.Schema({
  payment_id:String,
  type:String,
});

const PaymentType = mongoose.model('PaymentType', payment_typeSchema);

export default PaymentType;
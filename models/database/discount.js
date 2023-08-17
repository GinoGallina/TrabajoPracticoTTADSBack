import mongoose from 'mongoose';
import { date } from 'zod';


const discountSchema = new mongoose.Schema({
  discount_id:String,
  created_date:date,
  update_date:date
});

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
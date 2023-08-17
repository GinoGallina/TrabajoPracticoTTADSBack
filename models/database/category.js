import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
  category_id:String,
  category:String,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
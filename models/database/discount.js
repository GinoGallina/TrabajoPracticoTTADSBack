import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const discountSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Discount must have a value'],
    min: [1, 'Value must be at least 1'],
    max: [100, 'Value must be 100 or lower']
  },
  state: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // Referencia a la categoría
},
{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

discountSchema.plugin(mongooseUniqueValidator)
const Discount = mongoose.model('Discount', discountSchema)

export default Discount

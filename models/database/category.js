import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category must have a name'],
    unique: [true, 'Cant have two categories with the same name'],
    uniqueCaseInsensitive: [true, 'Cant have two categories with the same name']
  },
  state: { type: String, enum: ['Active', 'Archived'], default: 'Active' }
},
{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
}
)

// Hook para actualizar updatedAt en cada actualización
/* categorySchema.pre('updateCategoryById', function (next) {
  this.set({ updatedAt: new Date() })
  next()
}) */

categorySchema.plugin(mongooseUniqueValidator)
const Category = mongoose.model('Category', categorySchema)

export default Category

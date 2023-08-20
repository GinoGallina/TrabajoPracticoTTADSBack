import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  //  category_id:{
  //    type:String,
  //    required: [true, 'Por favor ingrese el nombre de la categoria'],
  //  },
  category: {
    type: String,
    required: [true, 'Por favor ingrese el nombre de la categoria'],
    unique: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
},
{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true } // Para incluir campos virtuales en la serialización JSON
}
)

// Hook para actualizar updatedAt en cada actualización
categorySchema.pre('updateCategoryById', function (next) {
  this.set({ updatedAt: new Date() })
  next()
})

// Hook para la eliminación lógica
categorySchema.pre('findByIdAndUpdate', function (next) {
  if (this._update.deletedAt == null) {
    this._update.deletedAt = new Date()
  }
  next()
})

// Campo virtual para saber si el registro está eliminado
// VER SI LO SACO O NO
categorySchema.virtual('isDeleted').get(function () {
  return this.deletedAt !== null
})

const Category = mongoose.model('Category', categorySchema)

export default Category

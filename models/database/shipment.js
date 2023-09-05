import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const shipmentSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  comment: {
    type: String,
    required: [true, 'Review must have a comment']
  },
  state: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
  situation: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' }
  // order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } // Referencia a la categoría
},
{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

shipmentSchema.plugin(mongooseUniqueValidator)
const Shipment = mongoose.model('Shipment', shipmentSchema)

export default Shipment

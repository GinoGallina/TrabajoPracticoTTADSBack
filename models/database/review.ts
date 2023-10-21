import mongoose, { Document,Schema,Model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'


interface IReviewDocument extends IReview, Document { }

const reviewSchema: Schema<IReviewDocument> = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Review must have a comment']
  },
  rate: {
    type: Number,
    required: [true, 'Review must have a rate'],
    min: [1, 'Value must be at least 1'],
    max: [5, 'Value must be 5 or lower']
  },
  state: { type: String, enum: ['Active', 'Archived'], default: 'Active' }
  // order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } // Referencia a la categoría
},
{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

reviewSchema.plugin(mongooseUniqueValidator)
const Review: Model<IReviewDocument> = mongoose.model<IReviewDocument>('Review', reviewSchema)

export {Review,IReviewDocument}

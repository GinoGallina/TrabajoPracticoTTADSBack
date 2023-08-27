import Review from '../models/database/review.js'
import { validateReview } from '../schemas/review.js'

const ReviewController = {
  getAllReviews: async (req, res) => {
    try {
      const reviews = await Review.find({ state: 'Active' })
      // const reviews = await Review.find({ state: 'Active' }).populate('category')
      res.status(200).json(reviews)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  },

  getReviewById: async (req, res) => {
    try {
      const review = await Review.findOne({
        _id: req.params.id,
        state: 'Active'
      })
      /* const review = await Review.findOne({
        _id: req.params.id,
        state: 'Active'
      }).populate('order') */
      if (!review) {
        return res.status(404).json({ error: 'Review not found' })
      }

      res.status(200).json(review)
    } catch (error) {
      res.status(500).json(JSON.stringify(error))
    }
  },

  createReview: async (req, res) => {
    try {
      const result = validateReview(req.body)
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const newReview = new Review(req.body)
      const savedReview = await newReview.save()
      res.status(201).json({ message: 'Review created', data: savedReview })
    } catch (error) {
      res.status(500).json((error))
    }
  },

  updateReviewById: async (req, res) => {
    try {
      const updatedReview = await Review.findOneAndUpdate({
        _id: req.params.id,
        state: 'Active'
      },
      req.body,
      { new: true })

      if (!updatedReview) {
        return res.status(404).json({ error: 'Review not found' })
      }
      console.log(updatedReview)
      res.status(200).json(updatedReview)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  deleteReviewById: async (req, res) => {
    try {
      const reviewDeleted = await Review.findByIdAndUpdate(
        { _id: req.params.id },
        { state: 'Archived' },
        { new: true })

      if (!reviewDeleted) {
        return res.status(404).json({ error: 'Review not found' })
      }

      res.status(200).json({ message: 'Review deleted', data: reviewDeleted })
    } catch (error) {
      res.status(500).json(error)
    }
  }

}

export default ReviewController

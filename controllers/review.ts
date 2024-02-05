import { Review, IReviewDocument } from "../models/database/review.js";
import { Request, Response } from "express";
import { validateReview } from "../schemas/review.js";
import { ReviewRepository } from "./../repository/reviewRepository.js";
import { isAppropriate } from "../client/chatgpt_client.js";

const reviewRepository = new ReviewRepository();

const ReviewController = {
  getAllReviews: async (req: Request, res: Response) => {
    try {
      const reviews = await reviewRepository.findAll();
      res.status(200).json(reviews);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  getReviewById: async (req: Request, res: Response) => {
    try {
      const review = await reviewRepository.findOne({ id: req.params.id });
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.status(200).json(review);
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  },

  createReview: async (req: Request, res: Response) => {
    try {
      const result = validateReview(req.body);
      if (!result.success) {
        // 422 Unprocessable Entity
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      const isAppropriateComment: string = await isAppropriate(req.body.comment);
      console.log(isAppropriateComment); 
      console.log(req.body.comment);
      if (isAppropriateComment === 'true') {
        const savedReview = await reviewRepository.add(req.body);
        res.status(201).json({ message: "Review created", data: savedReview });
      }else{
        return res.status(400).json({ error: "Review contains inappropriate language" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateReviewById: async (req: Request, res: Response) => {
    try {
      const updatedReview = await reviewRepository.update(
        req.params.id,
        req.body,
      );

      if (!updatedReview) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.status(200).json(updatedReview);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteReviewById: async (req: Request, res: Response) => {
    try {
      const reviewDeleted = await reviewRepository.delete({
        id: req.params.id,
      });
      if (!reviewDeleted) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.status(200).json({ message: "Review deleted", data: reviewDeleted });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default ReviewController;

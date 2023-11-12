import { Router } from "express";

import ReviewController from "../controllers/review.js";

export const reviewRouter = Router();

reviewRouter.get("/", ReviewController.getAllReviews);
reviewRouter.post("/", ReviewController.createReview);
reviewRouter.get("/:id", ReviewController.getReviewById);
reviewRouter.delete("/:id", ReviewController.deleteReviewById);
reviewRouter.patch("/:id", ReviewController.updateReviewById);

export default reviewRouter;

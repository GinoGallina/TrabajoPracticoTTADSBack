import { Router } from "express";
import { container } from "tsyringe";
import { ReviewController } from "../controllers/ReviewController.js";

export const ReviewRouter = () => {
	const router = Router();

	const reviewController = container.resolve(ReviewController);

	router.get("/getAll", reviewController.getAll.bind(reviewController));
	router.get("/getOne/:id", reviewController.getOne.bind(reviewController));
	router.post("/create", reviewController.create.bind(reviewController));
	router.post("/delete/:id", reviewController.delete.bind(reviewController));

	return router;
};

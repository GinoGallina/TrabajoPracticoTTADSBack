import { IReviewCreateRequest, IReviewGetAllRequest, IReviewGetAllResponse, IReviewResponse } from "../types/IReview.js";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./BaseController.js";
import { ReviewService } from "../services/ReviewService.js";

@injectable()
export class ReviewController extends BaseController<
	ReviewService,
	IReviewGetAllRequest,
	IReviewGetAllResponse,
	IReviewResponse,
	IReviewCreateRequest,
	IReviewResponse,
	IReviewResponse
> {
	constructor(@inject("ReviewService") reviewService: ReviewService) {
		super(reviewService);
	}
}

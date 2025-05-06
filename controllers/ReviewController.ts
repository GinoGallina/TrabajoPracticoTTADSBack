import {
	IReviewCreateRequest,
	IReviewGetAllRequest,
	IReviewGetAllResponse,
	IReviewResponse,
	IReviewUpdateRequest,
} from "../types/IReview.js";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./BaseController.js";
import { ReviewService } from "../services/ReviewService.js";
import { IGenericDeleteResponse } from "../types/shared/IBaseResponse.js";

@injectable()
export class ReviewController extends BaseController<
	ReviewService,
	IReviewGetAllRequest,
	IReviewGetAllResponse,
	IReviewResponse,
	IReviewCreateRequest,
	IReviewResponse,
	IReviewUpdateRequest,
	IReviewResponse,
	IGenericDeleteResponse
> {
	constructor(@inject("ReviewService") reviewService: ReviewService) {
		super(reviewService);
	}
}

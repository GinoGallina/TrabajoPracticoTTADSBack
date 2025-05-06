import { IsNull, Repository } from "typeorm";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { inject, injectable } from "tsyringe";
import { Review } from "../models/database/Review.js";
import { IReviewGetAllRequest } from "../types/IReview.js";
import { BaseRepository } from "./BaseRepository.js";

@injectable()
export class ReviewRepository extends BaseRepository<Review> {
	constructor(
		@inject("ReviewTypeORMRepository")
		private readonly reviewRepository: Repository<Review>,
	) {
		super(Review, reviewRepository);
	}

	async getAll(query: IReviewGetAllRequest): Promise<{ items: Review[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Review>(["Rate", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Review>(query, validOrderColumns);

		const [items, totalCount] = await this.reviewRepository.findAndCount({
			where: { DeletedAt: IsNull(), ProductId: Number(query.productId) },
			select: { Id: true, Rate: true, Description: true, CreatedAt: true },
			relations: ["User"],
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}
}

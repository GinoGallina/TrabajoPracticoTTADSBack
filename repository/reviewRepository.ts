import { EntityManager, IsNull, Repository } from "typeorm";
import { createValidOrderColumns, getAllPaginationOptions } from "../utils/RepositoryHelpers.js";
import { inject, injectable } from "tsyringe";
import { Review } from "../models/database/review.js";
import { IReviewGetAllRequest } from "../types/IReview.js";

@injectable()
export class ReviewRepository {
	constructor(
		@inject("ReviewTypeORMRepository")
		private readonly repository: Repository<Review>,
	) {}

	getRepo = (manager?: EntityManager) => {
		return manager ? manager.getRepository(Review) : this.repository;
	};

	async getAll(query: IReviewGetAllRequest): Promise<{ items: Review[]; totalCount: number }> {
		const validOrderColumns = createValidOrderColumns<Review>(["Rate", "CreatedAt"]);

		const { skip, take, order } = getAllPaginationOptions<Review>(query, validOrderColumns);

		const [items, totalCount] = await this.repository.findAndCount({
			where: { DeletedAt: IsNull(), ProductId: Number(query.productId) },
			select: { Id: true, Rate: true, Description: true, CreatedAt: true },
			relations: ["User"],
			order,
			skip,
			take,
		});

		return { items, totalCount };
	}

	async getById(id: string): Promise<Review | null> {
		const reviewId = Number(id);

		if (isNaN(reviewId)) return null;

		const review = await this.repository.findOne({
			where: { Id: reviewId, DeletedAt: IsNull() },
		});

		if (!review) return null;

		return review;
	}

	async create(review: Review, manager?: EntityManager): Promise<Review> {
		const repo = this.getRepo(manager);
		return await repo.save(review);
	}

	// async update(id: string, data: Partial<Review>): Promise<Review | null> {
	// 	const review = await this.getById(id);
	// 	if (!review) return null;

	// 	Object.assign(review, data);
	// 	return await this.repository.save(review);
	// }

	async delete(id: string, manager?: EntityManager): Promise<boolean | null> {
		const reviewId = Number(id);

		if (isNaN(reviewId)) return null;

		const repo = this.getRepo(manager);
		const result = await repo.softDelete(id);
		return result.affected !== 0;
	}
}

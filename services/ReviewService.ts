import { DataSource } from "typeorm";
import { IReviewCreateRequest, IReviewGetAllRequest, IReviewGetAllResponse, IReviewResponse } from "../types/IReview.js";
import { IBaseResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { inject, injectable } from "tsyringe";
import { BaseService } from "./BaseService.js";
import { Review } from "../models/database/review.js";
import { ReviewRepository } from "../repository/reviewRepository.js";
import { AuthService } from "./AuthService.js";

@injectable()
export class ReviewService extends BaseService<Review> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("ReviewRepository") private readonly reviewRepository: ReviewRepository,
		@inject("AuthService") private readonly authService: AuthService,
	) {
		super(reviewRepository.getRepo());
	}

	async getAll(query: IReviewGetAllRequest): Promise<IBaseResponse<IReviewGetAllResponse | null>> {
		try {
			const reviews = await this.reviewRepository.getAll(query);
			return {
				message: "",
				data: {
					reviews: reviews.items.map((x) => ({
						id: x.Id!.toString(),
						description: x.Description,
						rate: x.Rate,
						user: x.User.Username,
						createdAt: x.CreatedAt!.toISOString(),
					})),
					totalCount: reviews?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo las reseñas", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	// async getOne(id: string): Promise<IBaseResponse<IReviewResponse | null>> {
	// 	try {
	// 		const review = await this.reviewRepository.getById(id);
	// 		if (!review)
	// 			return createErrorResponse("Categoría no encontrada", {
	// 				code: 404,
	// 				message: Messages.Error.EntityNotFound("Categoría", true),
	// 			});

	// 		return createSuccessResponse("Categoría obtenida correctamente", {
	// 			id: review.Id!.toString(),
	// 			name: review.Name,
	// 			createdAt: review.CreatedAt!.toISOString(),
	// 		});
	// 	} catch (e) {
	// 		console.log(e);
	// 		return createErrorResponse("Error creando comentario", {
	// 			code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
	// 			message: "",
	// 		});
	// 	}
	// }

	async create(rq: IReviewCreateRequest): Promise<IBaseResponse<IReviewResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Validate request
			if (!rq.Description) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la reseña", {
					code: 400,
					message: "No puede ingresar un comentario vacío.",
				});
			}

			if (!(0 <= rq.Rate || rq.Rate <= 5)) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la reseña", {
					code: 400,
					message: "La puntuación debe ser entre 1 y 5.",
				});
			}

			const reviewToCreate = new Review({
				Description: rq.Description,
				Rate: rq.Rate,
				UserId: Number(this.authService.getToken().id),
				ProductId: Number(rq.ProductId),
			});

			const review = await this.reviewRepository.create(reviewToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Reseña", true), {
				id: review.Id!.toString(),
				description: review.Description,
				rate: review.Rate,
				createdAt: review.CreatedAt!.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando reseña", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}

	async delete(id: string): Promise<IBaseResponse<IReviewResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			const existingReview = await this.reviewRepository.getById(id);

			if (existingReview == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar la comentario", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});
			}

			const deleteReviewResult = await this.reviewRepository.delete(id, manager);

			if (!deleteReviewResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityDeleted("Categoría", true), {
				id: existingReview.Id!.toString(),
				description: existingReview.Description,
				rate: existingReview.Rate,
				createdAt: existingReview.CreatedAt!.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error eliminando comentario", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}
}

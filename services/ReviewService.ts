import { DataSource, QueryRunner } from "typeorm";
import {
	IReviewCreateRequest,
	IReviewGetAllRequest,
	IReviewGetAllResponse,
	IReviewResponse,
	IReviewUpdateRequest,
} from "../types/IReview.js";
import { IBaseResponse, IGenericDeleteResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { inject, injectable } from "tsyringe";
import { BaseService } from "./BaseService.js";
import { Review } from "../models/database/Review.js";
import { ReviewRepository } from "../repository/ReviewRepository.js";
import { AuthService } from "./AuthService.js";
import { formatDateToArgentina } from "../utils/DateFormatter.js";

@injectable()
export class ReviewService extends BaseService<Review> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("ReviewRepository") private readonly reviewRepository: ReviewRepository,
		@inject("AuthService") private readonly authService: AuthService,
	) {
		super(reviewRepository.getRepo());
	}

	async validateReview(rq: IReviewCreateRequest | IReviewUpdateRequest, queryRunner: QueryRunner) {
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
	}

	async getAll(query: IReviewGetAllRequest): Promise<IBaseResponse<IReviewGetAllResponse | null>> {
		try {
			const reviews = await this.reviewRepository.getAll(query);

			const mappedReviews = reviews.items.map(
				(x) =>
					({
						id: x.Id!.toString(),
						description: x.Description,
						rate: x.Rate,
						user: x.User.Username,
						userId: x.User.Id!,
						createdAt: formatDateToArgentina(x.CreatedAt!),
					}) satisfies IReviewGetAllResponse["reviews"][number],
			);

			return {
				message: "",
				data: {
					reviews: mappedReviews,
					totalCount: reviews?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo las reseñas");
		}
	}

	async getOne(id: string): Promise<IBaseResponse<IReviewResponse | null>> {
		try {
			const review = await this.reviewRepository.getById(Number(id));
			if (!review)
				return createErrorResponse("Reseña no encontrada", {
					code: 404,
					message: Messages.Error.EntityNotFound("Reseña", true),
				});

			return createSuccessResponse<IReviewResponse>("Reseña obtenida correctamente", {
				id: review.Id!.toString(),
				description: review.Description,
				rate: review.Rate,
				createdAt: review.CreatedAt!.toISOString(),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo reseña");
		}
	}

	async create(rq: IReviewCreateRequest): Promise<IBaseResponse<IReviewResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Validate request
			const validateRq = await this.validateReview(rq, queryRunner);

			if (validateRq) return validateRq;

			const reviewToCreate = new Review({
				Description: rq.Description,
				Rate: rq.Rate,
				UserId: Number(this.authService.getToken().id),
				ProductId: Number(rq.ProductId),
			});

			const review = await this.reviewRepository.create(reviewToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse<IReviewResponse>(Messages.CRUD.EntityCreated("Reseña", true), {
				id: review.Id!.toString(),
				description: review.Description,
				rate: review.Rate,
				createdAt: formatDateToArgentina(review.CreatedAt!),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando reseña");
		} finally {
			await queryRunner.release();
		}
	}

	async update(id: string, rq: IReviewUpdateRequest): Promise<IBaseResponse<IReviewResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			const validateRq = await this.validateReview(rq, queryRunner);

			if (validateRq) return validateRq;

			const prevReview = await this.reviewRepository.getById(Number(id));

			if (!prevReview) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al editar la reseña", {
					code: 404,
					message: Messages.Error.EntityNotFound("Reseña", true),
				});
			}

			prevReview.Description = rq.Description;
			prevReview.Rate = rq.Rate;

			this.reviewRepository.update(id, prevReview, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse<IReviewResponse>(Messages.CRUD.EntityUpdated("Reseña", true), {
				id: prevReview.Id!.toString(),
				description: prevReview.Description,
				rate: prevReview.Rate,
				createdAt: formatDateToArgentina(prevReview.CreatedAt!),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando categoría");
		} finally {
			await queryRunner.release();
		}
	}

	async delete(id: string): Promise<IBaseResponse<IGenericDeleteResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			if ((await this.reviewRepository.existsById(id)) == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar la reseña", {
					code: 404,
					message: Messages.Error.EntityNotFound("Reseña", true),
				});
			}

			const deleteReviewResult = await this.reviewRepository.delete(id, manager);

			if (!deleteReviewResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse<IGenericDeleteResponse>(Messages.CRUD.EntityDeleted("Reseña", true), {
				id,
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error eliminando reseña");
		} finally {
			await queryRunner.release();
		}
	}
}

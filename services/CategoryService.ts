import { DataSource, QueryRunner } from "typeorm";
import { CategoryRepository } from "../repository/CategoryRepository.js";
import { ICategoryCreateRequest, ICategoryGetAllResponse, ICategoryResponse, ICategoryUpdateRequest } from "../types/ICategory.js";
import { IBaseResponse, IGenericDeleteResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { IGetCombo } from "../types/shared/IGetCombo.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { Category } from "../models/database/Category.js";
import { BaseService } from "./BaseService.js";
import { formatDateToArgentina } from "../utils/DateFormatter.js";

@injectable()
export class CategoryService extends BaseService<Category> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("CategoryRepository") private readonly categoryRepository: CategoryRepository,
	) {
		super(categoryRepository.getRepo());
	}

	async validateCategory(rq: ICategoryUpdateRequest | ICategoryCreateRequest, queryRunner: QueryRunner, id?: string) {
		// Validate request
		if (!rq.Name) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear la categoría", {
				code: 400,
				message: Messages.Error.FieldRequired("nombre"),
			});
		}

		// Not duplicated name
		if (await this.categoryRepository.existsBy("Name", rq.Name, id)) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear la categoría", {
				code: 400,
				message: Messages.Error.UniqueField("nombre"),
			});
		}
	}

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<ICategoryGetAllResponse | null>> {
		try {
			const categories = await this.categoryRepository.getAll(query);

			const mappedCategories = categories.items.map(
				(x) =>
					({
						id: x.Id!.toString(),
						name: x.Name,
						createdAt: formatDateToArgentina(x.CreatedAt!),
					}) satisfies ICategoryGetAllResponse["categories"][number],
			);
			return {
				message: "",
				data: {
					categories: mappedCategories,
					totalCount: categories?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo categorías");
		}
	}

	async getOne(id: string): Promise<IBaseResponse<ICategoryResponse | null>> {
		try {
			const category = await this.categoryRepository.getById(Number(id));
			if (!category)
				return createErrorResponse("Categoría no encontrada.", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});

			return createSuccessResponse<ICategoryResponse>("Categoría obtenida correctamente.", {
				id: category.Id!.toString(),
				name: category.Name,
				createdAt: formatDateToArgentina(category.CreatedAt!),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error creando categoría");
		}
	}
	async getCombo(): Promise<IBaseResponse<IGetCombo | null>> {
		try {
			const items = await this.categoryRepository.getCombo();
			return {
				message: "",
				data: {
					items,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo combo de categorías");
		}
	}

	async create(rq: ICategoryCreateRequest): Promise<IBaseResponse<ICategoryResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			const validateRq = await this.validateCategory(rq, queryRunner);

			if (validateRq) return validateRq;

			const categoryToCreate = new Category({
				Name: rq.Name,
			});

			const category = await this.categoryRepository.create(categoryToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse<ICategoryResponse>(Messages.CRUD.EntityCreated("Categoría", true), {
				id: category.Id!.toString(),
				name: category.Name,
				createdAt: formatDateToArgentina(category.CreatedAt!),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando categoría");
		} finally {
			await queryRunner.release();
		}
	}

	async update(id: string, rq: ICategoryCreateRequest): Promise<IBaseResponse<ICategoryResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			const validateRq = await this.validateCategory(rq, queryRunner, id);

			if (validateRq) return validateRq;

			const prevCategory = await this.categoryRepository.getById(Number(id));

			if (!prevCategory) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al editar la categoría", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});
			}

			prevCategory.Name = rq.Name;

			this.categoryRepository.update(id, prevCategory, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse<ICategoryResponse>(Messages.CRUD.EntityUpdated("Categoría", true), {
				id: prevCategory.Id!.toString(),
				name: prevCategory.Name,
				createdAt: formatDateToArgentina(prevCategory.CreatedAt!),
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
			if ((await this.categoryRepository.existsById(id)) == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar la categoría", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});
			}

			const deleteCategoryResult = await this.categoryRepository.delete(id, manager);

			if (!deleteCategoryResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse<IGenericDeleteResponse>(Messages.CRUD.EntityDeleted("Categoría", true), {
				id,
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error eliminando categoría");
		} finally {
			await queryRunner.release();
		}
	}
}

import { DataSource } from "typeorm";
import { CategoryRepository } from "../repository/CategoryRepository.js";
import { ICategoryCreateRequest, ICategoryGetAllResponse, ICategoryResponse } from "../types/ICategory.js";
import { IBaseResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { IGetCombo } from "../types/shared/IGetCombo.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { Category } from "../models/database/Category.js";
import { BaseService } from "./BaseService.js";

@injectable()
export class CategoryService extends BaseService<Category> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("CategoryRepository") private readonly categoryRepository: CategoryRepository,
	) {
		super(categoryRepository.getRepo());
	}

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<ICategoryGetAllResponse | null>> {
		try {
			const categories = await this.categoryRepository.getAll(query);
			return {
				message: "",
				data: {
					categories: categories.items.map((x) => ({
						id: x.Id!.toString(),
						name: x.Name,
						createdAt: x.CreatedAt!.toISOString(),
					})),
					totalCount: categories?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo categorías", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	async getOne(id: string): Promise<IBaseResponse<ICategoryResponse | null>> {
		try {
			const category = await this.categoryRepository.getById(id);
			if (!category)
				return createErrorResponse("Categoría no encontrada", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});

			return createSuccessResponse("Categoría obtenida correctamente", {
				id: category.Id!.toString(),
				name: category.Name,
				createdAt: category.CreatedAt!.toISOString(),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error creando categoría", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
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
			return createErrorResponse("Error obteniendo combo de categorías", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	async create(rq: ICategoryCreateRequest): Promise<IBaseResponse<ICategoryResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Validate request
			if (!rq.Name) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la categoría", {
					code: 400,
					message: Messages.Error.FieldRequired("nombre"),
				});
			}

			// Not duplicated name
			if (await this.existsBy("Name", rq.Name)) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la categoría", {
					code: 400,
					message: Messages.Error.UniqueField("nombre"),
				});
			}

			const categoryToCreate = new Category({
				Name: rq.Name,
			});

			const category = await this.categoryRepository.create(categoryToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Categoría", true), {
				id: category.Id!.toString(),
				name: category.Name,
				createdAt: category.CreatedAt!.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando categoría", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}

	async delete(id: string): Promise<IBaseResponse<ICategoryResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			const existingCategory = await this.categoryRepository.getById(id);

			if (existingCategory == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar la categoría", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});
			}

			const deleteCategoryResult = await this.categoryRepository.delete(id, manager);

			if (!deleteCategoryResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityDeleted("Categoría", true), {
				id: existingCategory.Id!.toString(),
				name: existingCategory.Name,
				createdAt: existingCategory.CreatedAt!.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error eliminando categoría", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}
}

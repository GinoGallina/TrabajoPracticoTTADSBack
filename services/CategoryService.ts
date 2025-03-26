import { DataSource } from "typeorm";
import { CategoryRepository } from "../repository/CategoryRepository.js";
import {
	CategoryCreateRequestSchema,
	CategoryResponseSchema,
} from "../schemas/category.js";
import { IBaseResponse } from "../schemas/shared/IBaseResponse.js";
import {
	createErrorResponse,
	createSuccessResponse,
} from "../utils/ResponseHelpers.js";

export class CategoryService {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		private readonly db: DataSource,
	) {}

	async getAll(): Promise<IBaseResponse<CategoryResponseSchema[] | null>> {
		try {
			const categories = await this.categoryRepository.getAll();
			return {
				message: "Categorías obtenidas correctamente",
				data: categories.map((x) => ({
					Id: x.Id,
					Name: x.Name,
					CreatedAt: x.CreatedAt.toISOString(),
				})),
				error: null,
				success: true,
			};
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "Error interno del servidor";
			return createErrorResponse("Error creando categoría", {
				Code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				Message: errorMessage,
			});
		}
	}

	async getOne(
		id: string,
	): Promise<IBaseResponse<CategoryResponseSchema | null>> {
		try {
			const category = await this.categoryRepository.getById(id);
			if (!category)
				return createErrorResponse("Categoría no encontrada", {
					Code: 404,
					Message: "Categoría no encontrada",
				});

			return createSuccessResponse("Categoría obtenida correctamente", {
				Id: category.Id,
				Name: category.Name,
				CreatedAt: category.CreatedAt.toISOString(),
			});
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "Error interno del servidor";
			return createErrorResponse("Error creando categoría", {
				Code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				Message: errorMessage,
			});
		}
	}

	async createCategory(
		rq: CategoryCreateRequestSchema,
	): Promise<IBaseResponse<CategoryResponseSchema | null>> {
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
					Code: 404, // TODO: BAD REQUEST CODE
					Message: "El nombre es obligatorio",
				});
			}

			// Not duplicated name
			if (
				(await this.categoryRepository.findByName(rq.Name, manager)) !=
				null
			) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la categoría", {
					Code: 404, // TODO: BAD REQUEST CODE
					Message: "El nombre debe ser único",
				});
			}

			const category = await this.categoryRepository.create(rq, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse("Categoría creada correctamente", {
				Id: category.Id,
				Name: category.Name,
				CreatedAt: category.CreatedAt.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			const errorMessage =
				e instanceof Error ? e.message : "Error interno del servidor";
			return createErrorResponse("Error creando categoría", {
				Code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				Message: errorMessage,
			});
		} finally {
			await queryRunner.release();
		}
	}

	// 	const category = await this.categoryRepository.create({ name });
	// 	return {
	// 		message: "Categoría creada correctamente",
	// 		data: category,
	// 		error: null,
	// 		success: true,
	// 	};
	// }
}

// import { CategoryRepository } from "../repository/userRepository.js";

// const userRepository = new UserRepository();
// const productRepository = new ProductRepository();

// type ServiceResult<T> = {
// 	success: boolean;
// 	data?: T;
// 	message?: string;
// };

// export const ProductService = {
// 	create: async (
// 		params: IProduct,
// 	): Promise<ServiceResult<IProduct | void>> => {
// 		/* create a product
// 		 * @param {seller_id} - seller that owns the product
// 		 * @param {name} name - name of the product
// 		 * @param {description}
// 		 * @param {price}
// 		 * @param {stock}
// 		 * @param {img}
// 		 */
// 		const result = await validateSeller(params.seller);
// 		if (result instanceof Error) {
// 			return {
// 				success: false,
// 				message: result.message,
// 			};
// 		}
// 		try {
// 			const addedProduct = await productRepository.add(params);
// 			return {
// 				success: true,
// 				data: addedProduct,
// 			};
// 		} catch (error) {
// 			return {
// 				success: false,
// 				message: "Failed to add product",
// 			};
// 		}
// 	},
// };

// const validateSeller = async (id: string): Promise<boolean | Error> => {
// 	try {
// 		const user: ISeller = (await userRepository.findOne({ id })) as ISeller;
// 		if (!user) {
// 			return new Error("Seller not found");
// 		}
// 		if (user.type !== "Seller") {
// 			return new Error("Seller invalid type");
// 		}
// 		if (user.state !== "Active") {
// 			return new Error("Seller invalid status");
// 		}
// 		return true;
// 	} catch (error) {
// 		console.log(error);

// 		throw new Error("An error occurred");
// 	}
// };

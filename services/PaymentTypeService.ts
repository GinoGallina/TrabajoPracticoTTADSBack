import { DataSource } from "typeorm";
import { PaymentTypeRepository } from "../repository/PaymentTypeRepository.js";
import { IPaymentTypeCreateRequest, IPaymentTypeGetAllResponse, IPaymentTypeResponse } from "../schemas/IPaymentType.js";
import { IBaseResponse } from "../schemas/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";

import { IGetCombo } from "../schemas/shared/IGetCombo.js";

export class PaymentTypeService {
	constructor(
		private readonly paymentTypeRepository: PaymentTypeRepository,
		private readonly db: DataSource,
	) {}

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<IPaymentTypeGetAllResponse | null>> {
		try {
			const paymentTypes = await this.paymentTypeRepository.getAll(query);
			return {
				message: "",
				data: {
					paymentTypes: paymentTypes.items.map((x) => ({
						id: x.Id.toString(),
						name: x.Name,
						createdAt: x.CreatedAt.toISOString(),
					})),
					totalCount: paymentTypes?.totalCount || 0,
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

	async getOne(id: string): Promise<IBaseResponse<IPaymentTypeResponse | null>> {
		try {
			const paymentType = await this.paymentTypeRepository.getById(id);
			if (!paymentType)
				return createErrorResponse("Categoría no encontrada", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});

			return createSuccessResponse("Categoría obtenida correctamente", {
				id: paymentType.Id.toString(),
				name: paymentType.Name,
				createdAt: paymentType.CreatedAt.toISOString(),
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
			const items = await this.paymentTypeRepository.getCombo();
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

	async create(rq: IPaymentTypeCreateRequest): Promise<IBaseResponse<IPaymentTypeResponse | null>> {
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
			if ((await this.paymentTypeRepository.findByName(rq.Name, manager)) != null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la categoría", {
					code: 400,
					message: Messages.Error.UniqueField("nombre"),
				});
			}

			const paymentType = await this.paymentTypeRepository.create(rq, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Categoría", true), {
				id: paymentType.Id.toString(),
				name: paymentType.Name,
				createdAt: paymentType.CreatedAt.toISOString(),
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

	async delete(id: string): Promise<IBaseResponse<IPaymentTypeResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			const existingPaymentType = await this.paymentTypeRepository.getById(id);

			if (existingPaymentType == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar la categoría", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});
			}

			const deletePaymentTypeResult = await this.paymentTypeRepository.delete(id, manager);

			if (!deletePaymentTypeResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityDeleted("Categoría", true), {
				id: existingPaymentType.Id.toString(),
				name: existingPaymentType.Name,
				createdAt: existingPaymentType.CreatedAt.toISOString(),
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

	// 	const paymentType = await this.paymentTypeRepository.create({ name });
	// 	return {
	// 		message: "Categoría creada correctamente",
	// 		data: paymentType,
	// 		error: null,
	// 		success: true,
	// 	};
	// }
}

// import { PaymentTypeRepository } from "../repository/userRepository.js";

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

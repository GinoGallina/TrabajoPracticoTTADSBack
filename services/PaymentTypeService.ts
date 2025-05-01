import { DataSource } from "typeorm";
import { PaymentTypeRepository } from "../repository/PaymentTypeRepository.js";
import { IPaymentTypeCreateRequest, IPaymentTypeGetAllResponse, IPaymentTypeResponse } from "../types/IPaymentType.js";
import { IBaseResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { IGetCombo } from "../types/shared/IGetCombo.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { BaseService } from "./BaseService.js";
import { PaymentType } from "../models/database/PaymentType.js";

@injectable()
export class PaymentTypeService extends BaseService<PaymentType> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("PaymentTypeRepository") private readonly paymentTypeRepository: PaymentTypeRepository,
	) {
		super(paymentTypeRepository.getRepo());
	}

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<IPaymentTypeGetAllResponse | null>> {
		try {
			const paymentTypes = await this.paymentTypeRepository.getAll(query);
			return {
				message: "",
				data: {
					paymentTypes: paymentTypes.items.map((x) => ({
						id: x.Id!.toString(),
						name: x.Name,
						createdAt: x.CreatedAt!.toISOString(),
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
				id: paymentType.Id!.toString(),
				name: paymentType.Name,
				createdAt: paymentType.CreatedAt!.toISOString(),
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
			if (await this.existsBy("Name", rq.Name)) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la categoría", {
					code: 400,
					message: Messages.Error.UniqueField("nombre"),
				});
			}

			const paymentTypeToCreate = new PaymentType({
				Name: rq.Name,
			});

			const paymentType = await this.paymentTypeRepository.create(paymentTypeToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Categoría", true), {
				id: paymentType.Id!.toString(),
				name: paymentType.Name,
				createdAt: paymentType.CreatedAt!.toISOString(),
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
				id: existingPaymentType.Id!.toString(),
				name: existingPaymentType.Name,
				createdAt: existingPaymentType.CreatedAt!.toISOString(),
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

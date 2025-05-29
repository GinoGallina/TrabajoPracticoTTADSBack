import { DataSource, QueryRunner } from "typeorm";
import { PaymentTypeRepository } from "../repository/PaymentTypeRepository.js";
import {
	IPaymentTypeCreateRequest,
	IPaymentTypeGetAllResponse,
	IPaymentTypeResponse,
	IPaymentTypeUpdateRequest,
} from "../types/IPaymentType.js";
import { IBaseResponse, IGenericDeleteResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { IGetCombo } from "../types/shared/IGetCombo.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { inject, injectable } from "tsyringe";
import { BaseService } from "./BaseService.js";
import { PaymentType } from "../models/database/PaymentType.js";
import { formatDateToArgentina } from "../utils/DateFormatter.js";

@injectable()
export class PaymentTypeService extends BaseService<PaymentType> {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("PaymentTypeRepository") private readonly paymentTypeRepository: PaymentTypeRepository,
	) {
		super(paymentTypeRepository.getRepo());
	}

	async validatePaymentType(rq: IPaymentTypeCreateRequest | IPaymentTypeUpdateRequest, queryRunner: QueryRunner, id?: string) {
		// Validate request
		if (!rq.Name) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear el método de pago", {
				code: 400,
				message: Messages.Error.FieldRequired("nombre"),
			});
		}

		// Not duplicated name
		if (await this.paymentTypeRepository.existsBy("Name", rq.Name, id)) {
			await queryRunner.rollbackTransaction();
			return createErrorResponse("Error al crear método de pago", {
				code: 400,
				message: Messages.Error.UniqueField("nombre"),
			});
		}
	}

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<IPaymentTypeGetAllResponse | null>> {
		try {
			const paymentTypes = await this.paymentTypeRepository.getAll(query);

			const mappedPaymentTypes = paymentTypes.items.map(
				(x) =>
					({
						id: x.Id!.toString(),
						name: x.Name,
						createdAt: formatDateToArgentina(x.CreatedAt!),
					}) satisfies IPaymentTypeGetAllResponse["paymentTypes"][number],
			);

			return {
				message: "",
				data: {
					paymentTypes: mappedPaymentTypes,
					totalCount: paymentTypes?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo métodos de pago");
		}
	}

	async getOne(id: string): Promise<IBaseResponse<IPaymentTypeResponse | null>> {
		try {
			const paymentType = await this.paymentTypeRepository.getById(Number(id));

			if (!paymentType)
				return createErrorResponse("Método de pago no encontrada", {
					code: 404,
					message: Messages.Error.EntityNotFound("Método de pago"),
				});

			return createSuccessResponse<IPaymentTypeResponse>("Método de pago obtenidao correctamente", {
				id: paymentType.Id!.toString(),
				name: paymentType.Name,
				createdAt: formatDateToArgentina(paymentType.CreatedAt!),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error creando método de pago");
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
			return createErrorResponse("Error obteniendo combo de métodos de pago");
		}
	}

	async create(rq: IPaymentTypeCreateRequest): Promise<IBaseResponse<IPaymentTypeResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			const validateRq = await this.validatePaymentType(rq, queryRunner);

			if (validateRq) return validateRq;

			const paymentTypeToCreate = new PaymentType({
				Name: rq.Name,
			});

			const paymentType = await this.paymentTypeRepository.create(paymentTypeToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse<IPaymentTypeResponse>(Messages.CRUD.EntityCreated("Método de pago"), {
				id: paymentType.Id!.toString(),
				name: paymentType.Name,
				createdAt: formatDateToArgentina(paymentType.CreatedAt!),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando método de pago");
		} finally {
			await queryRunner.release();
		}
	}

	async update(id: string, rq: IPaymentTypeUpdateRequest): Promise<IBaseResponse<IPaymentTypeResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			const validateRq = await this.validatePaymentType(rq, queryRunner, id);

			if (validateRq) return validateRq;

			const prevPaymentType = await this.paymentTypeRepository.getById(Number(id));

			if (!prevPaymentType) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al editar el método de pago", {
					code: 404,
					message: Messages.Error.EntityNotFound("Método de pago"),
				});
			}

			prevPaymentType.Name = rq.Name;

			const paymentType = await this.paymentTypeRepository.update(id, prevPaymentType, manager);

			if (!paymentType) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al editar el método de pago", {
					code: 404,
					message: Messages.Error.EntityNotFound("Método de pago"),
				});
			}

			await queryRunner.commitTransaction();

			return createSuccessResponse<IPaymentTypeResponse>(Messages.CRUD.EntityUpdated("Método de pago"), {
				id: paymentType.Id!.toString(),
				name: paymentType.Name,
				createdAt: formatDateToArgentina(paymentType.CreatedAt!),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error editando método de pago");
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
			if ((await this.paymentTypeRepository.existsById(id)) == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar el método de pago", {
					code: 404,
					message: Messages.Error.EntityNotFound("Método de pago"),
				});
			}

			const deletePaymentTypeResult = await this.paymentTypeRepository.delete(id, manager);

			if (!deletePaymentTypeResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse<IGenericDeleteResponse>(Messages.CRUD.EntityDeleted("Método de pago"), {
				id: id!.toString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error eliminando Método de pago");
		} finally {
			await queryRunner.release();
		}
	}
}

import { DataSource, In } from "typeorm";
import { OrderRepository } from "../repository/OrderRepository.js";
import { IBaseResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import { IOrderCreateRequest, IOrderGetAllResponse, IOrderGetOneResponse, IOrderResponse, OrderEnum } from "../types/IOrder.js";
import { PaymentTypeService } from "./PaymentTypeService.js";
import { ProductService } from "./ProductService.js";
import { inject, injectable } from "tsyringe";
import { Order } from "../models/database/Order.js";
import { OrderItemEnum } from "../types/IOrderItem.js";
import { AuthService } from "./AuthService.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { RoleEnum } from "../types/IRole.js";

@injectable()
export class OrderService {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("OrderRepository") private readonly orderRepository: OrderRepository,
		@inject("ProductService") private readonly productService: ProductService,
		@inject("PaymentTypeService") private readonly paymentTypeService: PaymentTypeService,
		@inject("AuthService") private readonly authService: AuthService,
	) {}

	async getAll(query: IGenericGetAllRequest): Promise<IBaseResponse<IOrderGetAllResponse | null>> {
		try {
			const categories = await this.orderRepository.getAll(query);
			return {
				message: "",
				data: {
					orders: categories.items.map((x) => ({
						id: x.Id!.toString(),
						status: x.Status,
						paymentType: x.PaymentType?.Name || "",
						user: x.User?.Username || "",
						shippingAddress: x.ShippingAddress,
						totalAmount: x.TotalPrice,
						items: x.OrderItems.map((y) => ({
							quantity: y.Quantity,
							product: y.Product?.Name || "",
						})),
						createdAt: x.CreatedAt!.toISOString(),
					})),
					totalCount: categories?.totalCount || 0,
				},
				error: null,
				success: true,
			};
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo las ordenes", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	async getOne(id: string): Promise<IBaseResponse<IOrderGetOneResponse | null>> {
		try {
			const order = await this.orderRepository.getById(id);
			if (!order)
				return createErrorResponse("Orden no encontrada", {
					code: 404,
					message: Messages.Error.EntityNotFound("Orden", true),
				});

			return createSuccessResponse("Orden obtenida correctamente", {
				shippingAddress: order.ShippingAddress,
				paymentType: order.PaymentType?.Name || "",
				status: order.Status,
				total: order.TotalPrice,
				user: this.authService.getToken().roles.includes(RoleEnum.Admin) ? order.User?.Username : "",
				items: order.OrderItems.map((x) => ({
					product: x.Product?.Name || "",
					quantity: x.Quantity,
					status: x.Status,
					price: x.SettedPrice,
				})),
			});
		} catch (e) {
			console.log(e);
			return createErrorResponse("Error obteniendo orden", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		}
	}

	async create(rq: IOrderCreateRequest): Promise<IBaseResponse<IOrderResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Validate request
			if (!(await this.paymentTypeService.exists(rq.PaymentTypeId))) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la orden", {
					code: 400,
					message: Messages.Error.EntityNotFound("Método de pago"),
				});
			}

			// Check all products exist
			const products = await this.productService.getEntities({
				select: ["Id", "Price"],
				where: { Id: In(rq.Items.map((x) => Number(x.ProductId))) },
			});

			if (products.length !== rq.Items.length) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la orden", {
					code: 400,
					message: Messages.Error.EntitiesNotFound("producto"),
				});
			}

			// Check quantities
			const invalidItem = rq.Items.find((x) => x.Quantity < 0);
			if (invalidItem) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la orden", {
					code: 400,
					message: Messages.Error.FieldGreaterThanZero("cantidad"),
				});
			}

			// Create Order
			const totalPrice = rq.Items.reduce((acc, item) => {
				const product = products.find((p) => p.Id === Number(item.ProductId));
				return acc + product!.Price! * item.Quantity;
			}, 0);

			const token = this.authService.getToken();

			const orderToCreate = new Order({
				PaymentTypeId: Number(rq.PaymentTypeId),
				UserId: Number(token.id),
				Status: OrderEnum.Pending,
				TotalPrice: totalPrice,
				ShippingAddress: rq.Address || token.address,
				OrderItems: rq.Items.map((x) => ({
					Quantity: x.Quantity,
					ProductId: Number(x.ProductId),
					Status: OrderItemEnum.Pending,
					SettedPrice: products.find((y) => y.Id === Number(x.ProductId))?.Price || 0,
				})),
			});

			const order = await this.orderRepository.create(orderToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Orden", true), {
				id: order.Id!.toString(),
				createdAt: order.CreatedAt!.toISOString(),
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error creando la orden", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}

	async delete(id: string): Promise<IBaseResponse<IOrderResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			const existingCategory = await this.orderRepository.getById(id);

			if (existingCategory == null) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al borrar la categoría", {
					code: 404,
					message: Messages.Error.EntityNotFound("Categoría", true),
				});
			}

			const deleteCategoryResult = await this.orderRepository.delete(id, manager);

			if (!deleteCategoryResult) throw new Error();

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityDeleted("Categoría", true), {
				id: existingCategory.Id!.toString(),
				// name: existingCategory.Name,
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

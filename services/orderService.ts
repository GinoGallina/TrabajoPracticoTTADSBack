import { DataSource, In } from "typeorm";
import { OrderRepository } from "../repository/OrderRepository.js";
import { IBaseResponse } from "../types/shared/IBaseResponse.js";
import { createErrorResponse, createSuccessResponse } from "../utils/ResponseHelpers.js";
import { Messages } from "../const/Messages.js";
import {
	IOrderCancelOrderResponse,
	IOrderCancelProductRequest,
	IOrderCreateRequest,
	IOrderGetAllResponse,
	IOrderGetOneResponse,
	IOrderResponse,
	OrderEnum,
} from "../types/IOrder.js";
import { inject, injectable } from "tsyringe";
import { Order } from "../models/database/Order.js";
import { OrderItemEnum } from "../types/IOrderItem.js";
import { AuthService } from "./AuthService.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";
import { RoleEnum } from "../types/IRole.js";
import { formatDateToArgentina } from "../utils/DateFormatter.js";
import { ProductRepository } from "../repository/ProductRepository.js";
import { PaymentTypeRepository } from "../repository/PaymentTypeRepository.js";

@injectable()
export class OrderService {
	constructor(
		@inject("DataSource") private readonly db: DataSource,
		@inject("OrderRepository") private readonly orderRepository: OrderRepository,
		@inject("ProductRepository") private readonly productRepository: ProductRepository,
		@inject("PaymentTypeRepository") private readonly paymentTypeRepository: PaymentTypeRepository,
		@inject("AuthService") private readonly authService: AuthService,
	) {}

	async cancelProduct(id: string, rq: IOrderCancelProductRequest): Promise<IBaseResponse<IOrderCancelOrderResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			const prevOrder = await this.orderRepository.getById(Number(id), { relations: { OrderItems: true } });

			if (!prevOrder) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al cancelar el producto de la orden", {
					code: 404,
					message: Messages.Error.EntityNotFound("Orden", true),
				});
			}

			const orderItem = prevOrder.OrderItems.find((x) => x.ProductId === Number(rq.ProductId));

			if (!orderItem) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al cancelar el producto de la orden", {
					code: 404,
					message: Messages.Error.EntityNotFound("Producto de la orden"),
				});
			}

			orderItem.Status = OrderItemEnum.Canceled;
			orderItem.CanceledAt = new Date();

			if (prevOrder.OrderItems.every((x) => x.Status === OrderItemEnum.Canceled)) {
				prevOrder.Status = OrderEnum.Canceled;
				prevOrder.CanceledAt = new Date();
			}

			await this.orderRepository.update(id, prevOrder, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse("Producto cancelado de la orden correctamente.", {
				id,
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error cancelando el producto la orden", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}

	async cancelOrder(id: string): Promise<IBaseResponse<IOrderCancelOrderResponse | null>> {
		// Crear queryRunner
		const queryRunner = this.db.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;

		try {
			// Check if exists
			const prevOrder = await this.orderRepository.getById(Number(id), { relations: { OrderItems: true } });

			if (!prevOrder) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al cancelar la orden", {
					code: 404,
					message: Messages.Error.EntityNotFound("Orden", true),
				});
			}

			// Check every product is still pending
			if (prevOrder.OrderItems.some((x) => x.Status !== OrderItemEnum.Pending && x.Status !== OrderItemEnum.Canceled)) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al cancelar la orden", {
					code: 400,
					message: "Existe al menos un producto de la orden cuyo estado NO es Pendiente, no puede cancelar la orden.",
				});
			}

			prevOrder.Status = OrderEnum.Canceled;

			prevOrder.CanceledAt = new Date();

			prevOrder.OrderItems.forEach((x) => (x.Status = OrderItemEnum.Canceled));

			await this.orderRepository.update(id, prevOrder, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse("Orden cancelada correctamente", {
				id,
			});
		} catch (e) {
			await queryRunner.rollbackTransaction();
			console.log(e);
			return createErrorResponse("Error eliminando la orden", {
				code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
				message: "",
			});
		} finally {
			await queryRunner.release();
		}
	}

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
						createdAt: formatDateToArgentina(x.CreatedAt!),
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
			const order = await this.orderRepository.getById(Number(id), {
				relations: { PaymentType: true, OrderItems: { Product: { User: true } }, User: true },
			});

			if (!order)
				return createErrorResponse("Orden no encontrada", {
					code: 404,
					message: Messages.Error.EntityNotFound("Orden", true),
				});

			return createSuccessResponse("Orden obtenida correctamente", {
				shippingAddress: order.ShippingAddress,
				paymentType: order.PaymentType?.Name || "",
				status: order.Status,
				userId: order.User?.Id?.toString(),
				total: order.TotalPrice,
				user: this.authService.getToken().roles.includes(RoleEnum.Admin) ? order.User?.Username : "",
				items: order.OrderItems.map((x) => ({
					product: x.Product?.Name || "",
					productId: x.Product?.Id?.toString() || "",
					quantity: x.Quantity,
					status: x.Status,
					user: `${x.Product?.User.StoreName} - ${x.Product?.User.Username}`,
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
			if (!(await this.paymentTypeRepository.existsById(rq.PaymentTypeId))) {
				await queryRunner.rollbackTransaction();
				return createErrorResponse("Error al crear la orden", {
					code: 400,
					message: Messages.Error.EntityNotFound("Método de pago"),
				});
			}

			// Check all products exist
			const products = await this.productRepository.findAll({
				select: {
					Id: true,
					Price: true,
				},
				where: { Id: In(rq.Items.map((x) => Number(x.ProductId))) },
			});

			if (products?.items.length !== rq.Items.length) {
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
				const product = products?.items.find((p) => p.Id === Number(item.ProductId));
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
					SettedPrice: products?.items.find((y) => y.Id === Number(x.ProductId))?.Price || 0,
				})),
			});

			const order = await this.orderRepository.create(orderToCreate, manager);

			await queryRunner.commitTransaction();

			return createSuccessResponse(Messages.CRUD.EntityCreated("Orden", true), {
				id: order.Id!.toString(),
				createdAt: formatDateToArgentina(order.CreatedAt!),
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

	// TODO
	// async delete(id: string): Promise<IBaseResponse<IGenericDeleteResponse | null>> {
	// 	// Crear queryRunner
	// 	const queryRunner = this.db.createQueryRunner();
	// 	await queryRunner.connect();
	// 	await queryRunner.startTransaction();
	// 	const manager = queryRunner.manager;

	// 	try {
	// 		// Check if exists
	// 		if ((await this.orderRepository.existsById(id)) == null) {
	// 			await queryRunner.rollbackTransaction();
	// 			return createErrorResponse("Error al borrar la orden", {
	// 				code: 404,
	// 				message: Messages.Error.EntityNotFound("Orden", true),
	// 			});
	// 		}

	// 		const deleteCategoryResult = await this.orderRepository.delete(id, manager);

	// 		if (!deleteCategoryResult) throw new Error();

	// 		await queryRunner.commitTransaction();

	// 		return createSuccessResponse(Messages.CRUD.EntityDeleted("Orden", true), {
	// 			id,
	// 		});
	// 	} catch (e) {
	// 		await queryRunner.rollbackTransaction();
	// 		console.log(e);
	// 		return createErrorResponse("Error eliminando la orden", {
	// 			code: e instanceof Error ? 500 : 500, // TODO: CODE DE error si es instance of Error
	// 			message: "",
	// 		});
	// 	} finally {
	// 		await queryRunner.release();
	// 	}
	// }
}

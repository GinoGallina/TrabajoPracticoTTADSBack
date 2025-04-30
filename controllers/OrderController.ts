import { OrderService } from "../services/OrderService.js";
import { inject, injectable } from "tsyringe";
import { BaseController } from "./BaseController.js";
import { IOrderCreateRequest, IOrderGetAllResponse, IOrderGetOneResponse, IOrderResponse } from "../types/IOrder.js";
import { IGenericGetAllRequest } from "../types/shared/IBaseRequest.js";

@injectable()
export class OrderController extends BaseController<
	OrderService,
	IGenericGetAllRequest,
	IOrderGetAllResponse,
	IOrderGetOneResponse,
	IOrderCreateRequest,
	IOrderResponse,
	IOrderResponse
> {
	constructor(@inject("OrderService") orderService: OrderService) {
		super(orderService);
	}
}

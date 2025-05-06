import { IOrderItemCreateRequest, OrderItemEnum } from "./IOrderItem.js";
import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Order status
export enum OrderEnum {
	Pending = "Pending",
	Completed = "Completed",
	Canceled = "Canceled",
}

// Get All
export interface IOrderGetAllResponse extends IGenericGetAllResponse {
	orders: {
		id: string;
		paymentType: string;
		user?: string;
		shippingAddress: string;
		createdAt: string;
		items: { product: string; quantity: number }[];
	}[];
}

// Get One
export interface IOrderGetOneResponse {
	paymentType: string;
	userId?: string;
	shippingAddress: string;
	total: number;
	items: {
		product: string;
		productId: string;
		quantity: number;
		status: OrderItemEnum;
		imagen?: string;
		user: string;
		price: number;
	}[];
}

// Responses
export interface IOrderResponse {
	id: string;
	createdAt: string;
}

// Create
export interface IOrderCreateRequest {
	PaymentTypeId: string;
	Items: IOrderItemCreateRequest[];
	Address: string;
}
// Update
export interface IOrderUpdateRequest {
	PaymentTypeId: string;
	Items: IOrderItemCreateRequest[];
	Address: string;
}

// Cancel
export interface IOrderCancelProductRequest {
	ProductId: string;
}
export interface IOrderCancelOrderResponse {
	id: string;
}

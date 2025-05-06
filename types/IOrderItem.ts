export enum OrderItemEnum {
	Pending = "Pending",
	Paid = "Paid",
	Shipped = "Shipped",
	Delivered = "Delivered",
	Canceled = "Canceled",
}

export interface IOrderItemCreateRequest {
	ProductId: string;
	Quantity: number;
}

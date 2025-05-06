import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All
export interface IPaymentTypeGetAllResponse extends IGenericGetAllResponse {
	paymentTypes: { id: string; name: string; createdAt: string }[];
}

// Responses
export interface IPaymentTypeResponse {
	id: string;
	name: string;
	createdAt: string;
}

// Create
export interface IPaymentTypeCreateRequest {
	Name: string;
}
// Update
export interface IPaymentTypeUpdateRequest {
	Name: string;
}

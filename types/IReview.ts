import { IGenericGetAllRequest } from "./shared/IBaseRequest.js";
import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All
export interface IReviewGetAllRequest extends IGenericGetAllRequest {
	productId: string;
}

export interface IReviewGetAllResponse extends IGenericGetAllResponse {
	reviews: {
		id: string;
		description: string;
		rate: number;
		user: string;
		createdAt: string;
	}[];
}

// Get One
export interface IReviewGetOneResponse {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
	image?: string;
	categoryId: string;
	userId: string;
	createdAt: string;
}

// Responses
export interface IReviewResponse {
	id: string;
	description: string;
	rate: number;
	createdAt: string;
}

// Create
export interface IReviewCreateRequest {
	Description: string;
	Rate: number;
	ProductId: string;
}

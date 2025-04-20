import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All
export interface ICategoryGetAllResponse extends IGenericGetAllResponse {
	categories: { id: string; name: string; createdAt: string }[];
}

// Responses
export interface ICategoryResponse {
	id: string;
	name: string;
	createdAt: string;
}

// Create
export interface ICategoryCreateRequest {
	Name: string;
}

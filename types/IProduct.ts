import { IGenericGetAllRequest } from "./shared/IBaseRequest.js";
import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All
export interface IMyProductGetAllRequest extends IGenericGetAllRequest {
	userId?: string;
}

export interface IProductGetAllRequest extends IGenericGetAllRequest {
	text?: string;
	categoryIds?: string[];
	available?: boolean;
	price?: number;
	lessThan?: boolean;
}

export interface IProductGetAllResponse extends IGenericGetAllResponse {
	products: {
		id: string;
		name: string;
		description: string;
		price: number;
		stock: number;
		categoryName: string;
		categoryId: string;
		createdAt: string;
	}[];
}

// Get Details
export interface IProductGetDetailsResponse {
	name: string;
	description: string;
	price: number;
	stock: number;
	image?: string;
	categoryName: string;
	userName: string;
	createdAt: string;
}

// Get One
export interface IProductGetOneResponse {
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
export interface IProductResponse {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
	image?: string;
	createdAt: string;
}

// Create
export interface IProductCreateRequest {
	Name: string;
	Description: string;
	Price: number;
	Stock: number;
	Image?: string;
	CategoryId: string;
	UserId: string;
}

// import { z } from "zod";
// import StateSchema from "../types/states.js";

// const productSchema = z.object({
//   seller: z.string(),
//   category: z.string(),
//   name: z.string(),
//   description: z.string(),
//   price: z.number(),
//   stock: z.number(),
//   img: z.string(),
//   state: StateSchema,
// });

// export function validateProduct(input: unknown) {
//   return productSchema.safeParse(input);
// }

// export function validatePartialProduct(input: unknown) {
//   return productSchema.partial().safeParse(input);
// }

// export default productSchema;

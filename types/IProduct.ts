import { IGenericGetAllRequest } from "./shared/IBaseRequest.js";
import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All My Products
export interface IMyProductGetAllResponse extends IGenericGetAllResponse {
	products: {
		id: string;
		name: string;
		categoryName: string;
		user: string;
		price: number;
		stock: number;
		createdAt: string;
	}[];
}

// Get All Products
export interface IProductGetAllRequest extends IGenericGetAllRequest {
	text?: string;
	categoryIds?: string[];
	available?: string;
	price?: number;
	priceOption?: string;
}

export interface IProductGetAllResponse extends IGenericGetAllResponse {
	products: {
		id: string;
		name: string;
		price: number;
		image?: string;
		stock: number;
		categoryName: string;
		rating: {
			rate: number;
			totalReviews: number;
		};
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
	sellerDetails: {
		userName: string;
		storeName: string;
		storeDescription: string;
	};
	rating: {
		rate: number;
		totalReviews: number;
	};
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
	rating: {
		rate: number;
		totalReviews: number;
	};
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
// Update
export interface IProductUpdateRequest {
	Name: string;
	Description: string;
	Price: number;
	Stock: number;
	Image?: string;
	CategoryId: string;
	UserId: string;
}

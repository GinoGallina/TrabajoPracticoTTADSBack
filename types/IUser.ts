import { RoleEnum } from "./IRole.js";
import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All
export interface IUserGetAllResponse extends IGenericGetAllResponse {
	users: { id: string; email: string; username: string; address: string; roles: string[]; createdAt: string }[];
}

// Responses
export interface IUserResponse {
	id: string;
	username: string;
	email: string;
	address: string;
	roles: string[];
	storeName?: string;
	storeDescription?: string;
	cbu?: string;
	cuit?: string;
	createdAt: string;
}

// Create
export interface IUserCreateRequest {
	Email: string;
	Username: string;
	Password: string;
	Address: string;
	Roles: string[];
	StoreName?: string; // Seller
	StoreDescription?: string; // Seller
	Cbu?: string; // Seller
	Cuit?: string; // Seller
}

// Combo
export interface IUserGetComboRequest {
	roles: RoleEnum[];
}

//Register
export interface IUserRegisterResponse {
	id: string;
	username: string;
	email: string;
	address: string;
	roles: RoleEnum[];
}

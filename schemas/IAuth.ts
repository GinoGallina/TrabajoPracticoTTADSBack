import { IToken } from "./shared/IToken.js";

// Login
export interface ILoginRequest {
	email: string;
	password: string;
}

export interface ILoginResponse extends IToken {
	token: string;
	sessionExpiration: string;
}

// Register
export interface IRegisterRequest {
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

export interface IRegisterResponse extends IToken {
	token: string;
	sessionExpiration: string;
}

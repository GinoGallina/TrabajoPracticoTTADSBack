import { User } from "../models/database/User.js";
import { RoleEnum } from "./IRole.js";
import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All
export interface IUserGetAllResponse extends IGenericGetAllResponse {
	users: { id: string; email: string; username: string; address: string; roles: string[]; createdAt: string }[];
}

// Get one and responses
export interface IUserGetOneRequest {
	id: string;
}
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
	roles: RoleEnum[];
}

// Delete
export interface IUserDeleteRequest {
	Id: string;
}

// Find By Fields
export type UserFindByType = Pick<User, "Email" | "Username">;

// import { z, ZodError } from "zod";

// type UserType = "Admin" | "User" | "Seller";
// type UserState = "Active" | "Banned" | "Deactivate";

// const UserTypeSchema = z
//   .enum(["Admin", "User", "Seller"])
//   .refine((value) => ["Admin", "User", "Seller"].includes(value), {
//     message: "User must be a valid type",
//   });

// const UserStateSchema = z
//   .enum(["Active", "Banned", "Deactivate"])
//   .refine((value) => ["Active", "Banned", "Deactivate"].includes(value), {
//     message: "User must be a valid state",
//   })
//   .default("Active");

// const userSchema = z.object({
//   username: z.string().min(5).trim(),
//   email: z.string().email({ message: "Invalid email address" }),
//   type: UserTypeSchema,
//   password: z.string().min(6),
//   address: z.string(),
//   state: UserStateSchema.optional(),
//   cbu: z.string().optional(),
//   shop_name: z.string().optional(),
//   cuit: z.string().optional(),
// });

// const userUpdateSchema = userSchema
//   .pick({
//     type: true,
//     password: true,
//     address: true,
//     state: true,
//   })
//   .partial();

// export function validatePartialUserUpdate(input: IUser): {
//   success: boolean;
//   data?: any;
//   error?: ZodError;
// } {
//   return userUpdateSchema.safeParse(input);
// }

// export function validateUser(input: IUser): {
//   success: boolean;
//   data?: any;
//   error?: ZodError;
// } {
//   return userSchema.safeParse(input);
// }

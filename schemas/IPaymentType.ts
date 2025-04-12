import { IGenericGetAllResponse } from "./shared/IBaseResponse.js";

// Get All
export interface IPaymentTypeGetAllResponse extends IGenericGetAllResponse {
	paymentTypes: { id: string; name: string; createdAt: string }[];
}

// Get one and responses
export interface IPaymentTypeGetOneRequest {
	id: string;
}
export interface IPaymentTypeResponse {
	id: string;
	name: string;
	createdAt: string;
}

// Create
export interface IPaymentTypeCreateRequest {
	Name: string;
}

// Delete
export interface IPaymentTypeDeleteRequest {
	Id: string;
}

// import { z } from "zod";
// import StateSchema from "../types/states.js";

// const PaymentTypeSchema = z.object({
//   type: z
//     .string()
//     .min(5)
//     .refine((value) => value.trim().length > 0, {
//       message: "Type can not be empty or contain only spaces",
//     }),
//   state: StateSchema,
// });

// export function validatePaymentType(input: unknown) {
//   return PaymentTypeSchema.safeParse(input);
// }

// export function validatePartialPaymentType(input: unknown) {
//   return PaymentTypeSchema.partial().safeParse(input);
// }

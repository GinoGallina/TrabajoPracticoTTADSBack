export interface CategoryResponseSchema {
	Id: number;
	Name: string;
	CreatedAt: string;
}
export interface CategoryGetOneRequestSchema {
	id: string;
}

export interface CategoryCreateRequestSchema {
	Name: string;
}
// export interface CategoryGetOneSchema

// import { z } from "zod";

// const categorySchema = z.object({
//   category: z
//     .string()
//     .min(5)
//     .refine((value) => value.trim().length > 0, {
//       message: "Comment cannot be empty or contain only spaces",
//     }),
//   state: z
//     .enum(["Active", "Archived"])
//     .refine((value) => ["Active", "Archived"].includes(value), {
//       message: "Category must be a valid type",
//     })
//     .default("Active"),
// });

// export function validateCategory(input: unknown) {
//   return categorySchema.safeParse(input);
// }

// export function validatePartialCategory(input: unknown) {
//   return categorySchema.partial().safeParse(input);
// }

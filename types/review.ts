// import { z } from "zod";

// const reviewSchema = z.object({
//   comment: z
//     .string()
//     .min(5, "Comment is too short ")
//     .refine((value) => value.trim().length > 0, {
//       message: "Comment cannot be empty or contain only spaces",
//     }),
//   rate: z
//     .number()
//     .min(1, "Rate must be between 1 and 5")
//     .max(5, "Rate must be between 1 and 5"),
//   state: z
//     .enum(["Active", "Archived"])
//     .refine((value) => ["Active", "Archived"].includes(value), {
//       message: "Review must be a valid type",
//     })
//     .default("Active"),
//   // order: z.string().regex(/^[0-9a-fA-F]{24}$/)
// });

// export function validateReview(input: unknown) {
//   return reviewSchema.safeParse(input);
// }

// export function validatePartialReview(input: unknown) {
//   return reviewSchema.partial().safeParse(input);
// }

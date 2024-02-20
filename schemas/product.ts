import { z } from "zod";
import StateSchema from "../types/states.js";

const productSchema = z.object({
  seller: z.string(),
  category: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number(),
  img: z.string(),
  state: StateSchema,
});

export function validateProduct(input: unknown) {
  return productSchema.safeParse(input);
}

export function validatePartialProduct(input: unknown) {
  return productSchema.partial().safeParse(input);
}

export default productSchema;

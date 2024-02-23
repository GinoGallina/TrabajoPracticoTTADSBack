import { z } from "zod";
import { orderSchema } from "./order";

const cartSchema = z.object({
  orders: z.array(orderSchema), // This validates an array of orders
});

export function validateCart(input: unknown) {
  return cartSchema.safeParse(input);
}

export function validatePartialCart(input: unknown) {
  return cartSchema.partial().safeParse(input);
}

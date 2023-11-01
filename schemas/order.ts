import { z } from "zod";

const orderSchema = z.object({
  unitprize: z.number(),
  quantity: z.number().min(1, "Quantity cannot be zero"),
  amount: z.number().min(0, "Amount must be bigger than zero"),
  state: z
    .enum(["Pending", "Completed", "Cancelled"])
    .refine((value) => ["Pending", "Completed", "Cancelled"].includes(value),{
      message: "Order stare must be a valid type"
    })
    .default("Pending"),
  shipment: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "Shipment must be valid"
    })
    .optional(),
  cart: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "Cart must be valid"
    })
    .optional(),
  completedAt: z.date().optional()
});

export function validateOrder(input: unknown) {
  return orderSchema.safeParse(input);
}

export function validatePartialOrder(input: unknown) {
  return orderSchema.partial().safeParse(input);
}

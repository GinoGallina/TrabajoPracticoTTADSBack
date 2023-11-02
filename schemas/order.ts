import { z } from "zod";

const orderSchema = z.object({
  quantity: z.number().min(1, "Quantity cannot be zero"),
  product: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "Product must be valid"
    }),
  state: z
    .enum(["Pending", "Completed", "Cancelled"])
    .refine((value) => ["Pending", "Completed", "Cancelled"].includes(value),{
      message: "Order stare must be a valid type"
    })
    .default("Pending"),
  //Datos de Shipment para cargarlo junto con la Order
  shipment_type: z
    .string()
    .min(5, "Shipment Type must be valid")
    .refine((value) => value.trim().length > 0, {
      message: "Shipment Type cannot be empty",
    }),
  delivery_address: z
    .string()
    .min(5, "Address is too short")
    .refine((value) => value.trim().length > 0, {
      message: "Address cannot be empty or contain only spaces",
    })
    .optional(),
  delivery_date: z.date().optional(),
  comment: z
    .string()
    .min(5, "Comment is too short")
    .refine((value) => value.trim().length > 0, {
      message: "Comment cannot be empty or contain only spaces",
    })
    .optional()
  
});

export function validateOrder(input: unknown) {
  return orderSchema.safeParse(input);
}

export function validatePartialOrder(input: unknown) {
  return orderSchema.partial().safeParse(input);
}

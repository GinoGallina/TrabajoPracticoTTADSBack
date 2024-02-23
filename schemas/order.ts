import { z } from "zod";

export const orderSchema = z.object({
  quantity: z.number().min(1, "Quantity cannot be zero"),
  product: z.string().refine((value) => value.trim().length > 0, {
    message: "Product must be valid",
  }),
  state: z
    .enum(["Completed", "Cancelled"])
    .refine((value) => ["Completed", "Cancelled"].includes(value), {
      message: "Order stare must be a valid type",
    })
    .default("Completed"),
  //Datos de Shipment para cargarlo junto con la Order
  shipment_type: z
    .enum(["home_delivery", "branch_office_pickup", "other"])
    .refine(
      (value) =>
        ["home_delivery", "branch_office_pickup", "other"].includes(value),
      {
        message: "Shipment_type must be a valid type",
      }
    ),
  delivery_address: z
    .string()
    .min(5, "Address is too short")
    .refine((value) => value.trim().length > 0, {
      message: "Address cannot be empty or contain only spaces",
    })
    .optional(),
  //delivery_date: z.date().optional(),
  comment: z
    .string()
    .min(5, "Comment is too short")
    .refine((value) => value.trim().length > 0, {
      message: "Comment cannot be empty or contain only spaces",
    })
    .optional(),
});

export function validateOrder(input: unknown) {
  return orderSchema.safeParse(input);
}

export function validatePartialOrder(input: unknown) {
  return orderSchema.partial().safeParse(input);
}

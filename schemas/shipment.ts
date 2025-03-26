// import { z } from "zod";

// const shipmentSchema = z.object({
//   shipment_type: z
//     .string()
//     .min(5, "D is too short")
//     .refine((value) => value.trim().length > 0, {
//       message: "Comment cannot be empty or contain only spaces",
//     }),
//   delivery_address: z.
//     string()
//     .min(5, "Address is too short")
//     .refine((value) => value.trim().length > 0, {
//       message: "Address cannot be empty or contain only spaces",
//     })
//     .optional(),
//   delivery_date: z.date().optional(),
//   comment: z
//     .string()
//     .min(5, "Comment is too short ")
//     .refine((value) => value.trim().length > 0, {
//       message: "Comment cannot be empty or contain only spaces",
//     })
//     .optional(),
//   state: z
//     .enum(["Active", "Archived"])
//     .refine((value) => ["Active", "Archived"].includes(value), {
//       message: "Shipment must be a valid type",
//     })
//     .default("Active"),
//   situation: z
//     .enum(["Pending", "In Transit", "Delivered"])
//     .refine((value) => ["Pending", "In Transit", "Delivered"].includes(value), {
//       message: "Shipment situation must be a valid type",
//     })
//     .default("Pending"),
// });

// export function validateShipment(input: unknown) {
//   return shipmentSchema.safeParse(input);
// }

// export function validatePartialShipment(input: unknown) {
//   return shipmentSchema.partial().safeParse(input);
// }

import { z } from 'zod'

const shipmentSchema = z.object({
  delivery_date: z.union([z.date(), z.null()]),
  comment: z.string().min(5, 'Comment is too short ').refine(value => value.trim().length > 0, {
    message: 'Comment cannot be empty or contain only spaces'
  }),
  state: z.enum(['Active', 'Archived'], { message: 'Shipment must be a valid type' }).default('Active'),
  situation: z.enum(['Pending', 'In Transit', 'Delivered'], { message: 'Shipment situation must be a valid type' }).default('Active')
})

export function validateShipment (input) {
  return shipmentSchema.safeParse(input)
}

export function validatePartialShipment (input) {
  return shipmentSchema.partial().safeParse(input)
}

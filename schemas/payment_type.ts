import { z } from 'zod'

const PaymentTypeSchema = z.object({
  type: z.string().min(5).refine(value => value.trim().length > 0, {
    message: 'Type can not be empty ro contain only spaces'
  }),
  state: z.enum(['Active', 'Archived'], { message: 'Payment Type must be a valid type' }).default('Active')
})

export function validatePaymentType (input) {
  return PaymentTypeSchema.safeParse(input)
}

export function validatePartialPaymentType (input) {
  return PaymentTypeSchema.partial().safeParse(input)
}

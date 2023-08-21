import { z } from 'zod'

const PaymentTypeSchema = z.object({
  type: z.string().min(5)
})

export function validatePaymentType (input) {
  return PaymentTypeSchema.safeParse(input)
}

export function validatePartialPaymentType (input) {
  return PaymentTypeSchema.partial().safeParse(input)
}

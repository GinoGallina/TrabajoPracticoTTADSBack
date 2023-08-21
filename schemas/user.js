import { z } from 'zod'

const userSchema = z.object({
  username: z.string().min(5).trim(),
  email: z.string().email({ messge: 'Invalid email address' }),
  type: z.enum(['Admin', 'User', 'Seller'], { message: 'User must be a valid type' }),
  password: z.string().min(6),
  address: z.string()
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}

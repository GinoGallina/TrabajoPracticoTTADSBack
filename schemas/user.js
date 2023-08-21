import { z } from 'zod'

const userSchema = z.object({
  username: z.string().min(5).trim(),
  email: z.string().email({ message: 'Invalid email address' }),
  type: z.enum(['Admin', 'User', 'Seller'], { message: 'User must be a valid type' }),
  password: z.string().min(6),
  address: z.string(),
  state: z.enum(['Active', 'Banned', 'Deactivate'], { message: 'User must be a valid type' }).default('Active')
})

const userUpdateSchema = z.object({
  type: z.enum(['Admin', 'User', 'Seller'], { message: 'User must be a valid type' }),
  password: z.string().min(6),
  address: z.string(),
  state: z.enum(['Active', 'Banned', 'Disable'], { message: 'User must be a valid type' }).default('Active')
}).partial()

export function validatePartialUserUpdate (input) {
  return userUpdateSchema.safeParse(input)
}

export function validateUser (input) {
  return userSchema.safeParse(input)
}

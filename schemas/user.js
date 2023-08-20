import { z } from 'zod'

const userSchema = z.object({
  username: z.string().min(5),
  email: z.string().email({ messge: 'Invalid email address' }),
  type: z.array(
    z.enum(['ADMIN', 'USER', 'SELLER']),
    {
      required_error: 'Type is required.',
      invalid_type_error: 'User must be a valid type'
    }
  ),
  password: z.string().min(6),
  address: z.string()
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}

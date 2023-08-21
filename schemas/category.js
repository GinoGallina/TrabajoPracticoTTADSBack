import { z } from 'zod'

const categorySchema = z.object({
  category: z.string().min(5),
  state: z.enum(['Active', 'Archived'], { message: 'Category must be a valid type' }).default('Active')
})

export function validateCategory (input) {
  return categorySchema.safeParse(input)
}

export function validatePartialCategory (input) {
  return categorySchema.partial().safeParse(input)
}

import { z } from 'zod'

const categorySchema = z.object({
  category: z.string().min(5).refine(value => value.trim().length > 0, {
    message: 'Comment cannot be empty or contain only spaces'
  }),
  state: z.enum(['Active', 'Archived']).optional().default('Active'),
})


export function validateCategory (input: unknown) {
  return categorySchema.safeParse(input)
}

export function validatePartialCategory (input: unknown) {
  return categorySchema.partial().safeParse(input)
}

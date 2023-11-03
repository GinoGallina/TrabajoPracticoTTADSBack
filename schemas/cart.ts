import { z } from "zod";

const categorySchema = z.object({
  member_id: z.string().refine((value) => value.trim().length > 0, {
    message: "member_id is required",
  }),
});

export function validateCart(input: unknown) {
  return categorySchema.safeParse(input);
}

export function validatePartialCart(input: unknown) {
  return categorySchema.partial().safeParse(input);
}

import { z } from 'zod';
const discountSchema = z.object({
    value: z.number().min(1).max(100),
    state: z.enum(['Active', 'Archived']).refine(value => ['Admin', 'User', 'Seller'].includes(value), { message: 'Discount must be a valid type' }).default('Active'),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/)
});
export function validateDiscount(input) {
    return discountSchema.safeParse(input);
}
export function validatePartialDiscount(input) {
    return discountSchema.partial().safeParse(input);
}
//# sourceMappingURL=discount.js.map
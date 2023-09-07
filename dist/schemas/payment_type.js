import { z } from 'zod';
import StateSchema from '../types/states.js';
const PaymentTypeSchema = z.object({
    type: z.string().min(5).refine(value => value.trim().length > 0, {
        message: 'Type can not be empty ro contain only spaces'
    }),
    state: StateSchema
});
export function validatePaymentType(input) {
    return PaymentTypeSchema.safeParse(input);
}
export function validatePartialPaymentType(input) {
    return PaymentTypeSchema.partial().safeParse(input);
}
//# sourceMappingURL=payment_type.js.map
import { Router } from 'express';
import PaymentTypeController from '../controllers/payment_type.js';
export const paymentTypeRouter = Router();
paymentTypeRouter.get('/', PaymentTypeController.getAllPaymentTypes);
paymentTypeRouter.post('/', PaymentTypeController.createPaymentType);
paymentTypeRouter.get('/:id', PaymentTypeController.getPaymentTypeById);
paymentTypeRouter.delete('/:id', PaymentTypeController.deletePaymentTypeById);
paymentTypeRouter.patch('/:id', PaymentTypeController.updatePaymentTypeById);
export default paymentTypeRouter;
//# sourceMappingURL=payment_type.js.map
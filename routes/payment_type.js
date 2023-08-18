import { Router } from 'express'

import  PaymentTypeController  from '../controllers/payment_type.js'

export const payment_typeRouter = Router()

payment_typeRouter.get('/', PaymentTypeController.getAllPaymentTypes)
payment_typeRouter.post('/', PaymentTypeController.createPaymentType)

payment_typeRouter.get('/:id', PaymentTypeController.getPaymentTypeById)
payment_typeRouter.delete('/:id', PaymentTypeController.deletePaymentTypeById)
payment_typeRouter.patch('/:id', PaymentTypeController.updatePaymentTypeById)

export default payment_typeRouter;
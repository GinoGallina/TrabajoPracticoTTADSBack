import { Router } from 'express'

import DiscountController from '../controllers/discount.js'

export const categoryRouter = Router()

categoryRouter.get('/', DiscountController.getAllDiscount)
categoryRouter.post('/', DiscountController.createDiscount)

categoryRouter.get('/:id', DiscountController.getDiscountById)
categoryRouter.delete('/:id', DiscountController.deleteDiscountById)
categoryRouter.patch('/:id', DiscountController.updateDiscountById)

export default categoryRouter

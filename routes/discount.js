import { Router } from 'express'

import DiscountController from '../controllers/discount.js'

export const discountRouter = Router()

discountRouter.get('/', DiscountController.getAllDiscounts)
discountRouter.post('/', DiscountController.createDiscount)

discountRouter.get('/:id', DiscountController.getDiscountById)
discountRouter.delete('/:id', DiscountController.deleteDiscountById)
discountRouter.patch('/:id', DiscountController.updateDiscountById)

export default discountRouter

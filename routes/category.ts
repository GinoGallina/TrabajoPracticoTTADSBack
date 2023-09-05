import { Router } from 'express'

import CategoryController from '../controllers/category'

export const categoryRouter = Router()

categoryRouter.get('/', CategoryController.getAllCategories)
categoryRouter.post('/', CategoryController.createCategory)

categoryRouter.get('/:id', CategoryController.getCategoryById)
categoryRouter.delete('/:id', CategoryController.deleteCategoryById)
categoryRouter.patch('/:id', CategoryController.updateCategoryById)

export default categoryRouter

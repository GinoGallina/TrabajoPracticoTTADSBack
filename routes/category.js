import { Router } from 'express'

import  CategoryController  from '../controllers/category.js'
import  validateCategoryDTO  from '../dto/category.dto.js'

export const categoryRouter = Router()

categoryRouter.get('/',CategoryController.getAllCategories)
categoryRouter.post('/',validateCategoryDTO, CategoryController.createCategory)

categoryRouter.get('/:id', CategoryController.getCategoryById)
categoryRouter.delete('/:id', CategoryController.logicDeleteCategoryById)
categoryRouter.patch('/:id',validateCategoryDTO, CategoryController.updateCategoryById)

export default categoryRouter;
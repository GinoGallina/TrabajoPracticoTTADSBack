import { Category, ICategoryDocument } from '../models/database/category.js'
import { Request, Response } from 'express';
import { validateCategory } from '../schemas/category.js'

const categoryController = {
  getAllCategories: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find({ state: 'Active' })
      res.status(200).json(categories)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  getCategoryById: async (req: Request, res: Response) => {
    try {
      const category = await Category.findOne({
        _id: req.params.id,
        state: 'Active'
      })
      if (!category) {
        return res.status(404).json({ error: 'Category not found' })
      }

      res.status(200).json(category)
    } catch (error) {
      res.status(500).json(JSON.stringify(error))
    }
  },

  createCategory: async (req: Request, res: Response) => {
    try {
      const result = validateCategory(req.body)
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const newCategory: ICategoryDocument = new Category(req.body)
      const savedCategory = await newCategory.save()
      res.status(201).json({ message: 'Category created', data: savedCategory })
    } catch (error) {
      res.status(500).json((error))
    }
  },

  updateCategoryById: async (req: Request, res: Response) => {
    try {
      const updatedCategory = await Category.findOneAndUpdate({
        _id: req.params.id,
        state: 'Active'
      },
        req.body,
        { new: true })

      if (!updatedCategory) {
        return res.status(404).json({ error: 'User not found' })
      }
      console.log(updatedCategory)
      res.status(200).json(updatedCategory)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  deleteCategoryById: async (req: Request, res: Response) => {
    try {
      const categoryDeleted = await Category.findByIdAndUpdate(
        { _id: req.params.id },
        { state: 'Archived' },
        { new: true })

      if (!categoryDeleted) {
        return res.status(404).json({ error: 'Category not found' })
      }

      res.status(200).json({ message: 'Category deleted', data: categoryDeleted })
    } catch (error) {
      res.status(500).json(error)
    }
  }

}

export default categoryController

import Discount from '../models/database/discount'
import { validateDiscount } from '../schemas/discount'
import { Request, Response } from 'express';

const discountController = {
  getAllDiscounts: async (req: Request, res:Response) => {
    try {
      const discounts = await Discount.find({ state: 'Active' }).populate('category')
      res.status(200).json(discounts)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  },

  getDiscountById: async (req: Request, res:Response) => {
    try {
      const discount = await Discount.findOne({
        _id: req.params.id,
        state: 'Active'
      }).populate('category')
      if (!discount) {
        return res.status(404).json({ error: 'Discount not found' })
      }

      res.status(200).json(discount)
    } catch (error) {
      res.status(500).json(JSON.stringify(error))
    }
  },

  createDiscount: async (req: Request, res:Response) => {
    try {
      const result = validateDiscount(req.body)
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const newDiscount = new Discount(req.body)
      const savedDiscount = await newDiscount.save()
      res.status(201).json({ message: 'Discount created', data: savedDiscount })
    } catch (error) {
      res.status(500).json((error))
    }
  },

  updateDiscountById: async (req: Request, res:Response) => {
    try {
      const updatedDiscount = await Discount.findOneAndUpdate({
        _id: req.params.id,
        state: 'Active'
      },
      req.body,
      { new: true })

      if (!updatedDiscount) {
        return res.status(404).json({ error: 'User not found' })
      }
      console.log(updatedDiscount)
      res.status(200).json(updatedDiscount)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  deleteDiscountById: async (req: Request, res:Response) => {
    try {
      const DiscountDeleted = await Discount.findByIdAndUpdate(
        { _id: req.params.id },
        { state: 'Archived' },
        { new: true })

      if (!DiscountDeleted) {
        return res.status(404).json({ error: 'Discount not found' })
      }

      res.status(200).json({ message: 'Discount deleted', data: DiscountDeleted })
    } catch (error) {
      res.status(500).json(error)
    }
  }

}

export default discountController

import PaymentType from '../models/database/payment_type.js'
import { validatePaymentType } from '../schemas/payment_type.js'
import { Request, Response } from 'express';

const paymenttypeController = {
  getAllPaymentTypes: async (req: Request, res:Response) => {
    try {
      const paymentTypes = await PaymentType.find({ state: 'Active'})
      res.status(200).json(paymentTypes)
    } catch (error) {
      res.status(500).json({ error: 'Error getting Payment Types' })
    }
  },

  getPaymentTypeById: async (req: Request, res:Response) => {
    try {
      const paymentType = await PaymentType.findById({
        _id: req.params.id,
        state: 'Active'
      })
      if (!paymentType) {
        res.status(404).json({ error: 'Payment Type not found' })
      }
      res.status(200).json(paymentType)
    } catch (error) {
      res.status(500).json({ error: 'Payment Type not found' })
    }
  },

  createPaymentType: async (req: Request, res:Response) => {
    try {
      const result = validatePaymentType(req.body)
      if (!result.success) {
        // 400 Bad Request
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const newPaymentType = new PaymentType(req.body)
      const savedPaymentType = await newPaymentType.save()
      res.status(201).json({ message: 'Payment Type created', data: savedPaymentType} )
    } catch (error) {
      res.status(500).json({ error: 'Payment Type creation error' })
    }
  },

  updatePaymentTypeById: async (req: Request, res:Response) => {
    try {
      const updatedPaymentType = await PaymentType.findByIdAndUpdate({
        _id: req.params.id,
        state: 'Active'
      },
        req.body,
        { new: true }
      )
      if (!updatedPaymentType) {
        return res.status(404).json({ error: 'Payment Type not found' })
      }
      res.status(200).json(updatedPaymentType)
    } catch (error) {
      res.status(500).json({ error: 'Error updating Payment Type' })
    }
  },

  deletePaymentTypeById: async (req: Request, res:Response) => {
    try {
      const paymentTypeDeleted = await PaymentType.findByIdAndUpdate(
        { _id: req.params.id },
        { state: 'Archived' },
        { new: true })
      if (!paymentTypeDeleted){
        return res.status(404).json({ error: 'Payment Type not found' })
      }
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: 'Error deleting Payment Type' })
    }
  }
}

export default paymenttypeController

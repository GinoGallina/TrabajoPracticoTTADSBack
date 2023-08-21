import PaymentType from '../models/database/payment_type.js'
import { validatePaymentType } from '../schemas/payment_type.js'

const paymenttypeController = {
  getAllPaymentTypes: async (req, res) => {
    try {
      const paymentTypes = await PaymentType.find()
      res.status(200).json(paymentTypes)
    } catch (error) {
      res.status(500).json({ error: 'Error getting Payment Types' })
    }
  },

  getPaymentTypeById: async (req, res) => {
    try {
      const paymentType = await PaymentType.findById(req.params.id)
      if (!paymentType) {
        res.status(404).json({ error: 'Payment Type not found' })
      }
      res.status(200).json(paymentType)
    } catch (error) {
      res.status(500).json({ error: 'Payment Type not found' })
    }
  },

  createPaymentType: async (req, res) => {
    try {
      const result = validatePaymentType(req.body)
      if (!result.success) {
        // 400 Bad Request
        return res.status(400).json({ error: JSON.paser(result.error.message) })
      }

      const newPaymentType = new PaymentType(result.data)
      const savedPaymentType = await newPaymentType.save()
      res.status(201).json(savedPaymentType)
    } catch (error) {
      res.status(500).json({ error: 'Payment Type creation error' })
    }
  },

  updatePaymentTypeById: async (req, res) => {
    try {
      const updatedPaymentType = await PaymentType.findByIdAndUpdate(
        req.params.id,
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

  deletePaymentTypeById: async (req, res) => {
    try {
      await PaymentType.findByIdAndDelete(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: 'Error deleting Payment Type' })
    }
  }
}

export default paymenttypeController

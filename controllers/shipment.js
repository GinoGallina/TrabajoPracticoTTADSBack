import Shipment from '../models/database/shipment.js'
import { validateShipment } from '../schemas/shipment.js'

const ShipmentController = {
  getAllShipments: async (req, res) => {
    try {
      const shipments = await Shipment.find({ state: 'Active' })
      res.status(200).json(shipments)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  },

  getShipmentById: async (req, res) => {
    try {
      const shipment = await Shipment.findOne({
        _id: req.params.id,
        state: 'Active'
      })
      /* const Shipment = await Shipment.findOne({
        _id: req.params.id,
        state: 'Active'
      }).populate('order') */
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' })
      }

      res.status(200).json(Shipment)
    } catch (error) {
      res.status(500).json(JSON.stringify(error))
    }
  },

  createShipment: async (req, res) => {
    try {
      const result = validateShipment(req.body)
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const newShipment = new Shipment(req.body)
      const savedShipment = await newShipment.save()
      res.status(201).json({ message: 'Shipment created', data: savedShipment })
    } catch (error) {
      res.status(500).json((error))
    }
  },

  updateShipmentById: async (req, res) => {
    try {
      const updatedShipment = await Shipment.findOneAndUpdate({
        _id: req.params.id,
        state: 'Active'
      },
      req.body,
      { new: true })

      if (!updatedShipment) {
        return res.status(404).json({ error: 'Shipment not found' })
      }
      console.log(updatedShipment)
      res.status(200).json(updatedShipment)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  deleteShipmentById: async (req, res) => {
    try {
      const ShipmentDeleted = await Shipment.findByIdAndUpdate(
        { _id: req.params.id },
        { state: 'Archived' },
        { new: true })

      if (!ShipmentDeleted) {
        return res.status(404).json({ error: 'Shipment not found' })
      }

      res.status(200).json({ message: 'Shipment deleted', data: ShipmentDeleted })
    } catch (error) {
      res.status(500).json(error)
    }
  }

}

export default ShipmentController

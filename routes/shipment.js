import { Router } from 'express'

import ShipmentController from '../controllers/shipment.js'

export const shipmentRouter = Router()

shipmentRouter.get('/', ShipmentController.getAllShipments)
shipmentRouter.post('/', ShipmentController.createShipment)

shipmentRouter.get('/:id', ShipmentController.getShipmentById)
shipmentRouter.delete('/:id', ShipmentController.deleteShipmentById)
shipmentRouter.patch('/:id', ShipmentController.updateShipmentById)

export default shipmentRouter

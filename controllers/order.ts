import { Order, IOrderDocument } from "../models/database/order.js";
import { Request, Response } from "express";
import { validateOrder } from "../schemas/order.js";
import IOrder from "../types/IOrder.js";

const OrderController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const result = validateOrder(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({error: JSON.parse(result.error.message)})
      }
      
      const newOrder: IOrderDocument = new Order(req.body);
      const orderSaved = await newOrder.save();

      if(!orderSaved.isNew){
        return res.json(500);
      }

      return res.json(201);

    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default OrderController;

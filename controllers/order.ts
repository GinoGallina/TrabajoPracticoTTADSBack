import { Order, IOrderDocument } from "../models/database/order.js";
import { Request, Response } from "express";
import { validateOrder } from "../schemas/order.js";
import IOrder from "../types/IOrder.js";

const OrderController = {
  createOrder: async (req: Request, res: Response) => {
    const newOrder: IOrderDocument = new Order({
      product: "65388dc45ab8e6fb26fb711e",
      quantity: 234,
      amount: 210,
      shipment: "64ffa3dbe3c42f1aa25002cb",
      cart: "654da9c49c3ebd4e1f2216a8",
      state: "Completed",
      unitPrice: 12,
    });
    await newOrder.save();
    return res.json(200);

    // try {
    //   const result = validateOrder(req.body);
    //   if (!result.success) {
    //     return res
    //       .status(400)
    //       .json({error: JSON.parse(result.error.message)})
    //   }

    //   const newOrder: IOrderDocument = new Order(req.body);

    // } catch (error) {
    //   res.status(500).json(error);
    // }
  },
};

export default OrderController;

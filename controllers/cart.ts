import { CartRepository } from "../repository/cartRepository.js";
import { Request, Response } from "express";
import { validateCart } from "../schemas/cart.js";

const cartRepository = new CartRepository();

export const cartController = {
  getCart: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const cart = await cartRepository.findCartByMember({
        id,
        state: "Pending",
      });
      res.status(200).json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  completeBuy: async (req: Request, res: Response) => {
    try {
      const cart = await cartRepository.completeBuy();
      res.status(201).json({ message: "buy completed", data: cart });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

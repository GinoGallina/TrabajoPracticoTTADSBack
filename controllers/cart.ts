import { CartRepository } from "../repository/cartRepository.js";
import { Request, Response } from "express";
import { validateCart } from "../schemas/cart.js";
import TokenManager from "../config/token.js";
import { CartFilter } from "../types/filters/CartFilter.js";
import { CartServices } from "../services/cartServices.js";

const cartRepository = new CartRepository();
const tokenManager = new TokenManager();

const cartController = {
  getCart: async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token: string | undefined = authHeader?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Token not provided or invalid." });
      }
      const user = tokenManager.verifyToken(token);
      if (!user) {
        return res.status(401).json({ message: "User Not Found" });
      }

      const filter: CartFilter = req.query as CartFilter;
      filter.user = user._id;
      const cart = await cartRepository.findCartByMember(filter);
      res.status(200).json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const orders = req.body;
      const memberId = req.headers["member_id"];
      if (!memberId) {
        return res.status(401).json({ error: "Invalid User" });
      }
      const result = await CartServices.create(orders, memberId);
      if (!result.success) {
        return res.status(500).json(result.message);
      }
      res.status(201).json({ message: "cart_created" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default cartController;

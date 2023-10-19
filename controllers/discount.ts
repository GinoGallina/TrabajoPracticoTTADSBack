import { DiscountReposirory } from "../repository/discountRepository.js";
import { validateDiscount } from "../schemas/discount.js";
import { Request, Response } from "express";

const discountReposirory = new DiscountReposirory();
const discountController = {
  getAllDiscounts: async (req: Request, res: Response) => {
    try {
      const discounts = await discountReposirory.findAll();
      res.status(200).json(discounts);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  getDiscountById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const discount = await discountReposirory.findOne({ id });
      if (!discount) {
        return res.status(404).json({ error: "Discount not found" });
      }
      res.status(200).json(discount);
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  },

  createDiscount: async (req: Request, res: Response) => {
    try {
      const result = validateDiscount(req.body);
      if (!result.success) {
        // 422 Unprocessable Entity
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }
      //VALIDAR CON MODEL
      const savedDiscount = await discountReposirory.add(req.body);
      res
        .status(201)
        .json({ message: "Discount created", data: savedDiscount });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateDiscountById: async (req: Request, res: Response) => {
    try {
      const updatedDiscount = await discountReposirory.update(
        req.params.id,
        req.body
      );

      if (!updatedDiscount) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log(updatedDiscount);
      res.status(200).json(updatedDiscount);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteDiscountById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const DiscountDeleted = await discountReposirory.delete({ id });

      if (!DiscountDeleted) {
        return res.status(404).json({ error: "Discount not found" });
      }

      res
        .status(200)
        .json({ message: "Discount deleted", data: DiscountDeleted });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default discountController;

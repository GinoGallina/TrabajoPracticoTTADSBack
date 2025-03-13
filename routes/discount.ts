import { Router } from "express";

import DiscountController from "../controllers/discount.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const discountRouter = Router();

discountRouter.get("/", DiscountController.getAllDiscounts);
discountRouter.post("/",adminMiddleware, DiscountController.createDiscount);
discountRouter.get("/:id", DiscountController.getDiscountById);
discountRouter.delete("/:id",adminMiddleware, DiscountController.deleteDiscountById);
discountRouter.patch("/:id",adminMiddleware, DiscountController.updateDiscountById);

export default discountRouter;

import { Router } from "express";
import cartController from "../controllers/cart.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { userAndSellerMiddleware } from "../middlewares/userAndSellerMiddleware.js";

export const cartRouter = Router();

cartRouter.get("/", userAndSellerMiddleware,cartController.getCart);
cartRouter.post("/", userAndSellerMiddleware,cartController.create);

export default cartRouter;

import { Router } from "express";
import OrderController from "../controllers/order.js";
import { userAndSellerMiddleware } from "../middlewares/userAndSellerMiddleware.js";

export const orderRouter = Router();

orderRouter.post("/", userAndSellerMiddleware,OrderController.createOrder);

export default orderRouter;

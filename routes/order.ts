import { Router } from "express";
import OrderController from "../controllers/order.js";

export const orderRouter = Router();

orderRouter.post("/", OrderController.createOrder);

export default orderRouter;

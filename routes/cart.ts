import { Router } from "express";
import { cartController } from "../controllers/cart";
export const cartRouter = Router();

cartRouter.get("/", cartController.getCart);
cartRouter.post("/", cartController.completeBuy);

export default cartRouter;

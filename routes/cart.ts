import { Router } from "express";
import cartController from "../controllers/cart.js";

export const cartRouter = Router();

cartRouter.get("/", cartController.getCart);
cartRouter.post("/", cartController.create);

export default cartRouter;

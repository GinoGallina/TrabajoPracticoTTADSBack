import { Router } from "express";
import sellerController from "../controllers/user.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const sellerRouter = Router();

sellerRouter.get("/",adminMiddleware, sellerController.getAllUsers);
sellerRouter.post("/",adminMiddleware, sellerController.createUser);
sellerRouter.get("/:id",adminMiddleware, sellerController.getUserById);
sellerRouter.delete("/:id",adminMiddleware, sellerController.deleteUserById);
sellerRouter.put("/:id",adminMiddleware, sellerController.updateUserById);

export default sellerRouter;

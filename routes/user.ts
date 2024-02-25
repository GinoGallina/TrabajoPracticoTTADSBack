import { Router } from "express";
import userController from "../controllers/user.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
const userRouter = Router();

userRouter.get("/",adminMiddleware, userController.getAllUsers);
userRouter.post("/create",adminMiddleware, userController.createUser);
userRouter.get("/:id",adminMiddleware, userController.getUserById);
userRouter.delete("/:id",adminMiddleware, userController.deleteUserById);
userRouter.put("/:id",adminMiddleware, userController.updateUserById);
userRouter.put("/activate/:id",adminMiddleware, userController.activateUserById);

export default userRouter;

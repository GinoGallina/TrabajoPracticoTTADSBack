import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController.js";

export const UserRouter = () => {
	const router = Router();

	const userController = container.resolve(UserController);

	router.get("/getAll", userController.getAll.bind(userController));
	router.get("/getOne", userController.getOne.bind(userController));
	router.post("/create", userController.create.bind(userController));
	router.post("/getCombo", userController.getCombo.bind(userController));
	router.post("/delete", userController.delete.bind(userController));

	return router;
};

// import { Router } from "express";
// import userController from "../controllers/user.js";

// const userRouter = Router();

// userRouter.get("/", userController.getAllUsers);
// userRouter.post("/", userController.createUser);
// userRouter.get("/:id", userController.getUserById);
// userRouter.delete("/:id", userController.deleteUserById);
// userRouter.put("/:id", userController.updateUserById);

// export default userRouter;

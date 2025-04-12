import { Router } from "express";
import { DataSource } from "typeorm";
import { User } from "../models/database/User.js";
import { UserController } from "../controllers/UserController.js";
import { UserRepository } from "../repository/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { Role } from "../models/database/Role.js";

export const UserRouter = (db: DataSource) => {
	const router = Router();
	const roleRepository = db.getRepository(Role);
	const userRepository = new UserRepository(db.getRepository(User), roleRepository);

	const userService = new UserService(db, userRepository, roleRepository);
	const userController = new UserController(userService);

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

import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController.js";
import { authorizeRoles } from "../middleware/Roles/AuthorizeRoles.js";
import { RoleEnum } from "../types/IRole.js";

export const UserRouter = () => {
	const router = Router();

	const userController = container.resolve(UserController);

	router.get("/getAll", authorizeRoles(RoleEnum.Admin), userController.getAll.bind(userController));
	router.get("/getOne/:id", userController.getOne.bind(userController));
	router.post("/create", authorizeRoles(RoleEnum.Admin), userController.create.bind(userController));
	router.post(
		"/update/:id",
		authorizeRoles(RoleEnum.Admin, RoleEnum.Seller, RoleEnum.User),
		userController.update.bind(userController),
	);
	router.post("/getCombo", userController.getCombo.bind(userController));
	router.post("/delete/:id", authorizeRoles(RoleEnum.Admin), userController.delete.bind(userController));

	return router;
};

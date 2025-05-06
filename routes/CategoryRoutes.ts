import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import { container } from "tsyringe";
import { RoleEnum } from "../types/IRole.js";
import { authorizeRoles } from "../middleware/Roles/AuthorizeRoles.js";

export const CategoryRouter = () => {
	const router = Router();

	const categoryController = container.resolve(CategoryController);

	router.get("/getAll", authorizeRoles(RoleEnum.Admin), categoryController.getAll.bind(categoryController));
	router.get("/getOne/:id", authorizeRoles(RoleEnum.Admin), categoryController.getOne.bind(categoryController));
	router.get(
		"/getCombo",
		authorizeRoles(RoleEnum.Admin, RoleEnum.User, RoleEnum.Seller),
		categoryController.getCombo.bind(categoryController),
	);
	router.post("/create", authorizeRoles(RoleEnum.Admin), categoryController.create.bind(categoryController));
	router.post("/update/:id", authorizeRoles(RoleEnum.Admin), categoryController.update.bind(categoryController));
	router.post("/delete/:id", authorizeRoles(RoleEnum.Admin), categoryController.delete.bind(categoryController));

	return router;
};

import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import { container } from "tsyringe";

export const CategoryRouter = () => {
	const router = Router();

	const categoryController = container.resolve(CategoryController);

	router.get("/getAll", categoryController.getAll.bind(categoryController));
	router.get("/getOne/:id", categoryController.getOne.bind(categoryController));
	router.get("/getCombo", categoryController.getCombo.bind(categoryController));
	router.post("/create", categoryController.create.bind(categoryController));
	router.post("/delete/:id", categoryController.delete.bind(categoryController));

	return router;
};

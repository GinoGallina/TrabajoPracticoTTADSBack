import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import { CategoryRepository } from "../repository/CategoryRepository.js";
import { Category } from "../models/database/Category.js";
import { CategoryService } from "../services/CategoryService.js";
import { DataSource } from "typeorm";

export const CategoryRouter = (db: DataSource, router: Router) => {
	const categoryRepository = new CategoryRepository(
		db.getRepository(Category),
	);

	const categoryService = new CategoryService(categoryRepository, db);
	const categoryController = new CategoryController(categoryService);

	router.get("/getAll", categoryController.getAll.bind(categoryController));
	router.get(
		"/getOne/:id",
		categoryController.getOne.bind(categoryController),
	);
	router.post("/create", categoryController.create.bind(categoryController));

	return router;
};

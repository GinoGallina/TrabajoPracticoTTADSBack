import { Router } from "express";
import { DataSource } from "typeorm";
import { Product } from "../models/database/Product.js";
import { ProductRepository } from "../repository/ProductRepository.js";
import { ProductService } from "../services/ProductService.js";
import { ProductController } from "../controllers/ProductController.js";
import { CategoryService } from "../services/CategoryService.js";
import { CategoryRepository } from "../repository/CategoryRepository.js";
import { Category } from "../models/database/Category.js";
import { User } from "../models/database/User.js";
import { UserRepository } from "../repository/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { Role } from "../models/database/Role.js";

export const ProductRouter = (db: DataSource) => {
	const router = Router();

	const productRepository = new ProductRepository(db.getRepository(Product));

	const categoryRepository = new CategoryRepository(db.getRepository(Category));
	const categoryService = new CategoryService(categoryRepository, db);

	const roleRepository = db.getRepository(Role);
	const userRepository = new UserRepository(db.getRepository(User), roleRepository);
	const userService = new UserService(db, userRepository, roleRepository);

	const productService = new ProductService(db, productRepository, categoryService, userService);
	const productController = new ProductController(productService);

	router.get("/getAllMyProducts", productController.getAllMyProducts.bind(productController));
	router.get("/getAll", productController.getAll.bind(productController));
	router.get("/getOne", productController.getOne.bind(productController));
	router.post("/create", productController.create.bind(productController));
	router.post("/delete", productController.delete.bind(productController));

	return router;
};

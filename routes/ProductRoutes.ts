import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { container } from "tsyringe";

export const ProductRouter = () => {
	const router = Router();

	const productController = container.resolve(ProductController);

	router.get("/getAllMyProducts", productController.getAllMyProducts.bind(productController));
	router.get("/getAll", productController.getAll.bind(productController));
	router.get("/getOne/:id", productController.getOne.bind(productController));
	router.get("/getDetails/:id", productController.getDetails.bind(productController));
	router.post("/create", productController.create.bind(productController));
	router.post("/delete/:id", productController.delete.bind(productController));

	return router;
};

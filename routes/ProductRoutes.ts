import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { container } from "tsyringe";
import { authorizeRoles } from "../middleware/Roles/AuthorizeRoles.js";
import { RoleEnum } from "../types/IRole.js";

export const ProductRouter = () => {
	const router = Router();

	const productController = container.resolve(ProductController);

	router.get(
		"/getAllMyProducts",
		authorizeRoles(RoleEnum.Admin, RoleEnum.Seller),
		productController.getAllMyProducts.bind(productController),
	);
	router.get("/getAll", productController.getAll.bind(productController));
	router.get("/getOne/:id", authorizeRoles(RoleEnum.Admin, RoleEnum.Seller), productController.getOne.bind(productController));
	router.get("/getDetails/:id", productController.getDetails.bind(productController));
	router.post("/create", authorizeRoles(RoleEnum.Admin, RoleEnum.Seller), productController.create.bind(productController));
	router.post("/update/:id", authorizeRoles(RoleEnum.Admin, RoleEnum.Seller), productController.update.bind(productController));
	router.post("/delete/:id", authorizeRoles(RoleEnum.Admin, RoleEnum.Seller), productController.delete.bind(productController));

	return router;
};

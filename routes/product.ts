import { Router } from "express";
import ProductController from "../controllers/product.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { sellerMiddleware } from "../middlewares/sellerMiddleware.js";

//import ProductController from '../controllers/product.js'

export const productRouter = Router();

productRouter.get("/", ProductController.getAllProducts);
productRouter.post("/",sellerMiddleware, ProductController.createProduct);
productRouter.get("/:id", ProductController.getProductById);
productRouter.delete("/:id",sellerMiddleware, ProductController.deleteProductById);
productRouter.put("/:id",sellerMiddleware, ProductController.updateProductById);

export default productRouter;

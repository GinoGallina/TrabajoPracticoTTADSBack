import { Router } from "express";

import CategoryController from "../controllers/category.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const categoryRouter = Router();

categoryRouter.get("/", CategoryController.getAllCategories);
categoryRouter.post("/",adminMiddleware, CategoryController.createCategory);
categoryRouter.get("/:id", CategoryController.getCategoryById);
categoryRouter.delete("/:id",adminMiddleware, CategoryController.deleteCategoryById);
categoryRouter.put("/:id",adminMiddleware, CategoryController.updateCategoryById);
export default categoryRouter;

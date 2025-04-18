import { Router } from "express";
import { RoleController } from "../controllers/RoleController.js";
import { container } from "tsyringe";

export const RoleRouter = () => {
	const router = Router();

	const roleController = container.resolve(RoleController);

	router.get("/getCombo", roleController.getCombo.bind(roleController));

	return router;
};
